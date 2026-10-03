CREATE TABLE public.proofbox_user_state (
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  proof_box_id uuid NOT NULL REFERENCES public.proof_boxes(id) ON DELETE CASCADE,
  starred boolean NOT NULL DEFAULT false,
  archived_at timestamptz,
  last_viewed_at timestamptz,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now(),
  PRIMARY KEY (user_id, proof_box_id)
);
GRANT SELECT, INSERT, UPDATE, DELETE ON public.proofbox_user_state TO authenticated;
GRANT ALL ON public.proofbox_user_state TO service_role;
ALTER TABLE public.proofbox_user_state ENABLE ROW LEVEL SECURITY;
CREATE POLICY user_state_select ON public.proofbox_user_state FOR SELECT TO authenticated USING (user_id = auth.uid());
CREATE POLICY user_state_insert ON public.proofbox_user_state FOR INSERT TO authenticated WITH CHECK (user_id = auth.uid() AND public.can_access_box(proof_box_id));
CREATE POLICY user_state_update ON public.proofbox_user_state FOR UPDATE TO authenticated USING (user_id = auth.uid()) WITH CHECK (user_id = auth.uid() AND public.can_access_box(proof_box_id));
CREATE POLICY user_state_delete ON public.proofbox_user_state FOR DELETE TO authenticated USING (user_id = auth.uid());
CREATE INDEX proofbox_user_state_recent_idx ON public.proofbox_user_state(user_id, last_viewed_at DESC);
CREATE INDEX proofbox_user_state_starred_idx ON public.proofbox_user_state(user_id, starred) WHERE starred = true;
CREATE INDEX proofbox_user_state_archived_idx ON public.proofbox_user_state(user_id, archived_at) WHERE archived_at IS NOT NULL;
CREATE TRIGGER proofbox_user_state_updated BEFORE UPDATE ON public.proofbox_user_state FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

CREATE TABLE public.payments (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  proof_box_id uuid NOT NULL REFERENCES public.proof_boxes(id) ON DELETE CASCADE,
  created_by uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  amount numeric(14,2) NOT NULL CHECK (amount > 0),
  payment_date date NOT NULL,
  description text NOT NULL CHECK (char_length(description) BETWEEN 1 AND 240),
  payment_method text NOT NULL DEFAULT 'bank_transfer' CHECK (payment_method IN ('bank_transfer','cash','card','other')),
  status text NOT NULL DEFAULT 'pending' CHECK (status IN ('pending','confirmed')),
  evidence_id uuid REFERENCES public.evidence(id) ON DELETE SET NULL,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT, INSERT, UPDATE, DELETE ON public.payments TO authenticated;
GRANT ALL ON public.payments TO service_role;
ALTER TABLE public.payments ENABLE ROW LEVEL SECURITY;
CREATE POLICY payments_select ON public.payments FOR SELECT TO authenticated USING (public.can_access_box(proof_box_id));
CREATE POLICY payments_insert ON public.payments FOR INSERT TO authenticated WITH CHECK (created_by = auth.uid() AND public.can_access_box(proof_box_id));
CREATE POLICY payments_update ON public.payments FOR UPDATE TO authenticated USING (created_by = auth.uid()) WITH CHECK (created_by = auth.uid() AND public.can_access_box(proof_box_id));
CREATE POLICY payments_delete ON public.payments FOR DELETE TO authenticated USING (created_by = auth.uid());
CREATE INDEX payments_box_date_idx ON public.payments(proof_box_id, payment_date DESC);
CREATE INDEX payments_creator_idx ON public.payments(created_by, created_at DESC);
CREATE TRIGGER payments_updated BEFORE UPDATE ON public.payments FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

CREATE TABLE public.reminders (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  proof_box_id uuid REFERENCES public.proof_boxes(id) ON DELETE CASCADE,
  title text NOT NULL CHECK (char_length(title) BETWEEN 1 AND 140),
  reminder_type text NOT NULL DEFAULT 'custom' CHECK (reminder_type IN ('due_date','payment','return','confirmation','custom')),
  remind_at timestamptz NOT NULL,
  advance_days integer NOT NULL DEFAULT 0 CHECK (advance_days IN (0,1,3,7)),
  note text,
  completed boolean NOT NULL DEFAULT false,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT, INSERT, UPDATE, DELETE ON public.reminders TO authenticated;
GRANT ALL ON public.reminders TO service_role;
ALTER TABLE public.reminders ENABLE ROW LEVEL SECURITY;
CREATE POLICY reminders_select ON public.reminders FOR SELECT TO authenticated USING (user_id = auth.uid());
CREATE POLICY reminders_insert ON public.reminders FOR INSERT TO authenticated WITH CHECK (user_id = auth.uid() AND (proof_box_id IS NULL OR public.can_access_box(proof_box_id)));
CREATE POLICY reminders_update ON public.reminders FOR UPDATE TO authenticated USING (user_id = auth.uid()) WITH CHECK (user_id = auth.uid() AND (proof_box_id IS NULL OR public.can_access_box(proof_box_id)));
CREATE POLICY reminders_delete ON public.reminders FOR DELETE TO authenticated USING (user_id = auth.uid());
CREATE INDEX reminders_user_date_idx ON public.reminders(user_id, completed, remind_at);
CREATE INDEX reminders_box_idx ON public.reminders(proof_box_id) WHERE proof_box_id IS NOT NULL;
CREATE TRIGGER reminders_updated BEFORE UPDATE ON public.reminders FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();