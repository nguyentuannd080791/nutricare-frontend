import { useEffect, useState } from "react";
import { planApi } from "../../../services/api";

const toSelections = (days) =>
  days.flatMap((d) => d.meals.map((m) => ({ dayIndex: d.dayIndex, mealSlot: m.mealSlot, dishId: m.dishId })));

/**
 * Trách nhiệm duy nhất: máy trạng thái của luồng "Đa dạng hoá bằng AI"
 * (limit -> loading -> ready/error) + gọi API liên quan. Màn hình chỉ lo hiển thị.
 */
export function usePlanDiversification({ plan, user, onProposed }) {
  const { aiPlan: aiPlanLimit } = user.limits;
  const [phase, setPhase] = useState(!user.isPremium && user.aiPlanCount >= aiPlanLimit ? "limit" : "loading");
  const [proposal, setProposal] = useState(null);

  useEffect(() => {
    if (phase !== "loading") return;
    let cancelled = false;
    planApi
      .diversify(plan.id)
      .then((res) => {
        if (cancelled) return;
        onProposed(); // lượt AI đã bị trừ ở server → làm mới bộ đếm
        if (res.status !== "ok") { setPhase("error"); return; }
        setProposal(res);
        setPhase("ready");
      })
      .catch((e) => !cancelled && setPhase(e.status === 403 ? "limit" : "error"));
    return () => { cancelled = true; };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return { phase, proposal, aiPlanLimit, selectionsFromProposal: () => toSelections(proposal.days) };
}
