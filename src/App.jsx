import React, { useEffect, useMemo, useState } from "react";
import { Sparkles, ClipboardList } from "lucide-react";
import { COLORS } from "./theme/colors";
import { Toast, Card, EmptyState, Button } from "./components/ui";
import BottomNav from "./navigation/BottomNav";

import LoginScreen from "./screens/Auth/LoginScreen";
import RegisterScreen from "./screens/Auth/RegisterScreen";
import OnboardingScreen from "./screens/Onboarding/OnboardingScreen";
import HomeScreen from "./screens/Home/HomeScreen";
import ScanScreen from "./screens/Scan/ScanScreen";
import ScanResultScreen from "./screens/Scan/ScanResultScreen";
import BMIScreen from "./screens/BMI/BMIScreen";
import ConditionsScreen from "./screens/Conditions/ConditionsScreen";
import TargetCreateScreen from "./screens/Target/TargetCreateScreen";
import TargetDetailScreen from "./screens/Target/TargetDetailScreen";
import PlanCreateScreen from "./screens/Plan/PlanCreateScreen";
import PlanViewScreen from "./screens/Plan/PlanViewScreen";
import PlanDiversifyScreen from "./screens/Plan/PlanDiversifyScreen";
import PlanHistoryScreen from "./screens/Plan/PlanHistoryScreen";
import ProfileScreen from "./screens/Profile/ProfileScreen";
import RemindersScreen from "./screens/Reminders/RemindersScreen";
import PremiumScreen from "./screens/Premium/PremiumScreen";
import FoodsScreen from "./screens/Foods/FoodsScreen";

import {
  meApi,
  bmiApi,
  targetApi,
  conditionApi,
  planApi,
  premiumApi,
} from "./services/api";
import { useToast } from "./hooks/useToast";
import { useAuth } from "./hooks/useAuth";
import { useServerData } from "./hooks/useServerData";
import { useLocalData } from "./hooks/useLocalData";
import { useAppNavigation } from "./hooks/useAppNavigation";
import { initAnalytics, trackPageView, trackEvent } from "./lib/analytics";

/**
 * Coordinator duy nhất của app (Dependency Inversion — tương đương App.js gốc):
 * nối các hook trách nhiệm-đơn (auth/serverData/localData/toast/navigation)
 * lại với nhau và điều phối luồng dữ liệu giữa chúng + các màn hình. Bản thân
 * App.jsx không tự chứa logic phức tạp — chỉ orchestration + các handler mỏng
 * gọi thẳng service API rồi reload đúng phần dữ liệu bị ảnh hưởng.
 */
export default function App() {
  const { toast, showToast, reportError } = useToast();
  const {
    serverData,
    loadAll,
    reload,
    clear: clearServerData,
  } = useServerData();
  const {
    localData,
    load: loadLocal,
    clear: clearLocalData,
    update: updateLocalData,
    toggleMeal,
  } = useLocalData();
  const nav = useAppNavigation();
  const [authScreen, setAuthScreen] = useState("login"); // login | register

  const {
    booting,
    user,
    setUser,
    login,
    register,
    logout,
    refreshUser,
    updateProfile,
  } = useAuth({
    onSessionStart: async (nextUser) => {
      await Promise.all([loadAll(), loadLocal(nextUser.id)]);
    },
    onSessionEnd: () => {
      clearServerData();
      clearLocalData();
      setAuthScreen("login");
      nav.reset();
    },
    onSessionExpired: (msg) => showToast(msg, "warn"),
  });

  const userData = useMemo(
    () => (serverData && localData ? { ...serverData, ...localData } : null),
    [serverData, localData],
  );
  const activeTarget = userData?.targets.find((t) => t.isActive);
  const activePlan = userData?.mealPlans.find((p) => p.isActive);

  useEffect(initAnalytics, []);

  // Virtual pageview: URL không đổi khi chuyển tab/overlay (SPA 1 trang), nên
  // tự suy ra "đường dẫn ảo" từ đúng state đang quyết định renderContent() hiển
  // thị gì, rồi báo cho GA mỗi khi state đó đổi.
  useEffect(() => {
    if (booting) return;
    let virtualPath = "/auth/" + authScreen;
    if (user && userData) {
      if (userData.bmiRecords.length === 0) virtualPath = "/onboarding";
      else if (nav.overlay) virtualPath = "/" + nav.overlay;
      else if (nav.tab === "scan" && nav.scanPending)
        virtualPath = "/scan/result";
      else virtualPath = "/" + nav.tab;
    }
    trackPageView(virtualPath);
  }, [
    booting,
    user,
    userData,
    authScreen,
    nav.tab,
    nav.overlay,
    nav.scanPending,
  ]);

  // --- Onboarding: hồ sơ + BMI đầu tiên (server tự tạo mục tiêu dinh dưỡng đầu tiên) ---
  async function handleOnboardingComplete({
    dob,
    gender,
    heightCm,
    weightKg,
    goalId,
    activityId,
  }) {
    try {
      setUser(await meApi.update({ dob, gender }));
      await bmiApi.create({ heightCm, weightKg, goalId, activityId });
      await reload("bmiRecords", "targets");
      showToast("Đã tạo mục tiêu dinh dưỡng đầu tiên của bạn!");
      return null;
    } catch (e) {
      return e.message;
    }
  }

  // --- BMI: server quyết định có tạo lại mục tiêu hay không ---
  async function handleAddBMI(payload) {
    try {
      const { targetRecalculated, decision, target, calorieAdjustment } =
        await bmiApi.create(payload);
      await reload("bmiRecords", "targets");

      let message = activePlan
        ? "Đã lưu chỉ số mới. Thay đổi chưa đủ ngưỡng nên mục tiêu & thực đơn hiện tại vẫn giữ nguyên."
        : "Đã lưu chỉ số BMI mới.";
      let tone = "success";
      if (targetRecalculated) {
        message = `Cân nặng thay đổi ${decision.pctChange?.toFixed(1)}% — mục tiêu dinh dưỡng đã cập nhật còn ${target.calories} kcal/ngày.${activePlan ? " Hãy xây lại thực đơn để khớp mục tiêu mới." : ""}`;
        tone = "warn";
      }
      if (calorieAdjustment !== 0) {
        message += ` Vòng lặp phản hồi Premium: cân nặng 7 ngày qua chưa khớp mục tiêu, đã tự động ${calorieAdjustment > 0 ? "tăng" : "giảm"} ${Math.abs(calorieAdjustment)} kcal.`;
        tone = "warn";
      }
      showToast(message, tone);
    } catch (e) {
      reportError(e);
    }
  }

  // --- Bệnh nền / Dị ứng ---
  async function handleSaveCondition(payload, editingId) {
    try {
      await (editingId
        ? conditionApi.update(editingId, payload)
        : conditionApi.create(payload));
      await reload("conditions");
      showToast(editingId ? "Đã cập nhật" : "Đã thêm mới");
    } catch (e) {
      reportError(e);
    }
  }

  async function handleDeleteCondition(id) {
    try {
      await conditionApi.remove(id);
      await reload("conditions");
      showToast("Đã xoá");
    } catch (e) {
      reportError(e);
    }
  }

  // --- Mục tiêu dinh dưỡng ---
  async function handleCreateTarget(payload) {
    try {
      await targetApi.create(payload);
      await reload("targets");
      nav.closeOverlay();
      if (activeTarget && activePlan) {
        showToast(
          "Đã tạo mục tiêu mới. Vì bạn vừa đổi mục tiêu/hoạt động, hãy xây lại thực đơn để chọn món phù hợp hơn.",
          "warn",
        );
      } else {
        showToast("Đã tạo mục tiêu dinh dưỡng!");
      }
    } catch (e) {
      reportError(e);
    }
  }

  // --- Thực đơn ---
  async function handleCreatePlan(days) {
    try {
      await planApi.generate(days);
      await reload("mealPlans");
      trackEvent("plan_created", { days });
      nav.closeOverlay();
      nav.goToTab("plan");
      showToast("Đã cập nhật thực đơn!");
    } catch (e) {
      reportError(e);
    }
  }

  async function handleSwap(payload) {
    try {
      await planApi.swap(payload);
      await reload("mealPlans");
      showToast("Đã đổi món.");
    } catch (e) {
      reportError(e);
    }
  }

  async function handleApplyDiversification(selections) {
    try {
      await planApi.applyDiversification(activePlan.id, selections);
      await reload("mealPlans");
      trackEvent("plan_ai_diversify_applied");
      nav.closeOverlay();
      nav.goToTab("plan");
      showToast("Đã áp dụng gợi ý AI vào thực đơn!");
    } catch (e) {
      reportError(e);
    }
  }

  // --- Hồ sơ & Premium ---
  async function handleUpdateProfile(payload) {
    try {
      await updateProfile(payload);
      showToast("Đã cập nhật hồ sơ.");
    } catch (e) {
      reportError(e);
    }
  }

  // Mock paywall: server chỉ đổi cờ isPremium, chưa có thanh toán thật.
  async function handleSetPremium(value) {
    try {
      setUser(await (value ? premiumApi.upgrade() : premiumApi.cancel()));
      trackEvent(value ? "premium_upgraded" : "premium_cancelled");
      nav.closeOverlay();
      showToast(
        value ? "Chào mừng bạn đến với Premium! 🎉" : "Đã huỷ Premium.",
      );
    } catch (e) {
      reportError(e);
    }
  }

  function handleScanAnalyzed(payload) {
    nav.setScanPending(payload);
    refreshUser();
  }

  function handleScanSaved() {
    trackEvent("scan_saved");
    nav.setScanPending(null);
    showToast("Đã lưu vào nhật ký ăn uống!");
    nav.goToTab("home");
  }

  function renderPlanTab() {
    if (!activeTarget) {
      return (
        <div className="flex-1 flex items-center justify-center p-5">
          <Card className="p-5">
            <EmptyState
              icon={Sparkles}
              title="Cần có mục tiêu dinh dưỡng trước"
              desc="Hãy tạo mục tiêu dinh dưỡng ở Trang chủ trước khi xây thực đơn."
              action={
                <Button full onPress={() => nav.openOverlay("target-create")}>
                  Tạo mục tiêu ngay
                </Button>
              }
            />
          </Card>
        </div>
      );
    }
    if (!activePlan) {
      return (
        <div className="flex-1 flex items-center justify-center p-5">
          <Card className="p-5">
            <EmptyState
              icon={ClipboardList}
              title="Chưa có thực đơn"
              desc="Xây dựng thực đơn theo mục tiêu dinh dưỡng hiện tại của bạn."
              action={
                <Button
                  full
                  icon={Sparkles}
                  onPress={() => nav.openOverlay("plan-create")}
                >
                  Tạo thực đơn
                </Button>
              }
            />
          </Card>
        </div>
      );
    }
    return (
      <PlanViewScreen
        plan={activePlan}
        onBack={() => nav.goToTab("home")}
        onRebuild={() => nav.openOverlay("plan-create")}
        onViewHistory={() => nav.openOverlay("plan-history")}
        onSwap={handleSwap}
      />
    );
  }

  function renderOverlay() {
    const close = nav.closeOverlay;
    switch (nav.overlay) {
      case "bmi":
        return (
          <BMIScreen data={userData} onBack={close} onAddBMI={handleAddBMI} />
        );
      case "conditions":
        return (
          <ConditionsScreen
            data={userData}
            onBack={close}
            onSave={handleSaveCondition}
            onDelete={handleDeleteCondition}
          />
        );
      case "target-create":
        return (
          <TargetCreateScreen
            data={userData}
            onBack={close}
            onCreate={handleCreateTarget}
          />
        );
      case "target-detail":
        return (
          <TargetDetailScreen
            data={userData}
            onBack={close}
            onEdit={() => nav.openOverlay("target-create")}
          />
        );
      case "plan-create":
        return (
          <PlanCreateScreen
            data={userData}
            onBack={close}
            onCreate={handleCreatePlan}
          />
        );
      case "plan-diversify":
        return (
          <PlanDiversifyScreen
            plan={activePlan}
            user={user}
            onBack={close}
            onGoUpgrade={() => nav.openOverlay("premium")}
            onProposed={refreshUser}
            onApply={handleApplyDiversification}
          />
        );
      case "plan-history":
        return <PlanHistoryScreen data={userData} onBack={close} />;
      case "premium":
        return (
          <PremiumScreen
            user={user}
            onBack={close}
            onSetPremium={handleSetPremium}
          />
        );
      case "reminders":
        return (
          <RemindersScreen
            reminders={userData.reminders}
            onBack={close}
            onSave={(reminders) => updateLocalData(user.id, { reminders })}
          />
        );
      default:
        return null;
    }
  }

  function renderContent() {
    if (booting) {
      return (
        <div className="flex-1 min-h-0 flex items-center justify-center">
          <span className="w-9 h-9 rounded-full border-[3px] border-primary border-t-transparent animate-spin" />
        </div>
      );
    }
    if (!user || !userData) {
      return authScreen === "login" ? (
        <LoginScreen
          onLogin={login}
          onGoRegister={() => setAuthScreen("register")}
        />
      ) : (
        <RegisterScreen
          onRegister={register}
          onGoLogin={() => setAuthScreen("login")}
        />
      );
    }
    if (userData.bmiRecords.length === 0) {
      return (
        <OnboardingScreen
          fullName={user.fullName}
          onComplete={handleOnboardingComplete}
        />
      );
    }
    if (nav.overlay) return renderOverlay();

    return (
      <>
        <div className="flex-1 flex flex-col min-h-0">
          {nav.tab === "home" && (
            <HomeScreen
              user={user}
              userData={userData}
              onQuickAction={nav.handleQuickAction}
              onToggleMeal={(dk, mealSlot, planId) =>
                toggleMeal(user.id, dk, mealSlot, planId)
              }
            />
          )}
          {nav.tab === "scan" && !nav.scanPending && (
            <ScanScreen
              mealSlot="trua"
              onAnalyzed={handleScanAnalyzed}
              onCancel={() => nav.goToTab("home")}
            />
          )}
          {nav.tab === "scan" && nav.scanPending && (
            <ScanResultScreen
              scanId={nav.scanPending.scanId}
              photoUri={nav.scanPending.photoUri}
              result={nav.scanPending.result}
              onDone={handleScanSaved}
              onRetry={() => nav.setScanPending(null)}
            />
          )}
          {nav.tab === "foods" && <FoodsScreen />}
          {nav.tab === "plan" && renderPlanTab()}
          {nav.tab === "profile" && (
            <ProfileScreen
              user={user}
              data={userData}
              onLogout={logout}
              onGoTo={nav.handleQuickAction}
              onUpdateProfile={handleUpdateProfile}
            />
          )}
        </div>
        <BottomNav active={nav.tab} onChange={nav.goToTab} />
      </>
    );
  }

  return (
    <div
      className="h-full flex flex-col"
      style={{ backgroundColor: COLORS.bg }}
    >
      {renderContent()}
      <Toast toast={toast} />
    </div>
  );
}
