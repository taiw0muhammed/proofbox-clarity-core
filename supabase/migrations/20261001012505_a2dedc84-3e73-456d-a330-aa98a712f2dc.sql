DROP POLICY IF EXISTS boxes_select ON public.proof_boxes;
CREATE POLICY boxes_select ON public.proof_boxes
  FOR SELECT TO authenticated
  USING (creator_id = auth.uid() OR public.can_access_box(id));

DROP POLICY IF EXISTS boxes_update ON public.proof_boxes;
CREATE POLICY boxes_update ON public.proof_boxes
  FOR UPDATE TO authenticated
  USING (creator_id = auth.uid() OR public.can_access_box(id))
  WITH CHECK (creator_id = auth.uid() OR public.can_access_box(id));