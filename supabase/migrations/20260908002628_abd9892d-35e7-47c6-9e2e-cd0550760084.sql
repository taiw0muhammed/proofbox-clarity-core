
CREATE OR REPLACE FUNCTION public.set_updated_at() RETURNS trigger LANGUAGE plpgsql SET search_path = public AS $$
BEGIN NEW.updated_at = now(); RETURN NEW; END; $$;

CREATE TABLE public.profiles (
  id uuid PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  full_name text,
  email text,
  avatar_url text,
  notify_confirmations boolean NOT NULL DEFAULT true,
  notify_reminders boolean NOT NULL DEFAULT true,
  notify_evidence boolean NOT NULL DEFAULT true,
  onboarded boolean NOT NULL DEFAULT false,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT, INSERT, UPDATE ON public.profiles TO authenticated;
GRANT ALL ON public.profiles TO service_role;
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
CREATE TRIGGER profiles_updated BEFORE UPDATE ON public.profiles FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

CREATE TABLE public.proof_boxes (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  code text NOT NULL UNIQUE DEFAULT ('PB-' || upper(substr(replace(gen_random_uuid()::text,'-',''),1,5))),
  creator_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  title text NOT NULL CHECK (char_length(title) BETWEEN 1 AND 140),
  type text NOT NULL DEFAULT 'Custom' CHECK (type IN ('Borrow','Payment','Sale','Rental','Service','Delivery','Promise','Custom')),
  description text,
  terms text,
  responsibilities text,
  amount numeric(14,2),
  currency text NOT NULL DEFAULT 'NGN',
  start_date date,
  due_date date,
  status text NOT NULL DEFAULT 'draft' CHECK (status IN ('draft','awaiting_confirmation','confirmed','completed','disputed')),
  dispute_reason text,
  completed_by uuid REFERENCES auth.users(id),
  completed_at timestamptz,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);
CREATE INDEX proof_boxes_creator_idx ON public.proof_boxes(creator_id);
CREATE INDEX proof_boxes_status_idx ON public.proof_boxes(status);
GRANT SELECT, INSERT, UPDATE, DELETE ON public.proof_boxes TO authenticated;
GRANT ALL ON public.proof_boxes TO service_role;
ALTER TABLE public.proof_boxes ENABLE ROW LEVEL SECURITY;
CREATE TRIGGER proof_boxes_updated BEFORE UPDATE ON public.proof_boxes FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

CREATE TABLE public.participants (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  proof_box_id uuid NOT NULL REFERENCES public.proof_boxes(id) ON DELETE CASCADE,
  user_id uuid REFERENCES auth.users(id) ON DELETE SET NULL,
  invite_email text,
  invite_token uuid NOT NULL DEFAULT gen_random_uuid(),
  display_name text,
  role text NOT NULL DEFAULT 'participant',
  confirmation_status text NOT NULL DEFAULT 'pending' CHECK (confirmation_status IN ('pending','confirmed','changes_requested','declined')),
  change_request text,
  confirmed_at timestamptz,
  created_at timestamptz NOT NULL DEFAULT now()
);
CREATE UNIQUE INDEX participants_box_user_idx ON public.participants(proof_box_id, user_id) WHERE user_id IS NOT NULL;
CREATE INDEX participants_box_idx ON public.participants(proof_box_id);
CREATE INDEX participants_user_idx ON public.participants(user_id);
GRANT SELECT, INSERT, UPDATE, DELETE ON public.participants TO authenticated;
GRANT ALL ON public.participants TO service_role;
ALTER TABLE public.participants ENABLE ROW LEVEL SECURITY;

CREATE TABLE public.evidence (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  proof_box_id uuid NOT NULL REFERENCES public.proof_boxes(id) ON DELETE CASCADE,
  uploaded_by uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  file_name text NOT NULL,
  file_path text NOT NULL,
  file_type text,
  file_size bigint,
  description text,
  created_at timestamptz NOT NULL DEFAULT now()
);
CREATE INDEX evidence_box_idx ON public.evidence(proof_box_id);
GRANT SELECT, INSERT, UPDATE, DELETE ON public.evidence TO authenticated;
GRANT ALL ON public.evidence TO service_role;
ALTER TABLE public.evidence ENABLE ROW LEVEL SECURITY;

CREATE TABLE public.timeline_events (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  proof_box_id uuid NOT NULL REFERENCES public.proof_boxes(id) ON DELETE CASCADE,
  actor_id uuid REFERENCES auth.users(id) ON DELETE SET NULL,
  actor_name text,
  event_type text NOT NULL,
  description text,
  created_at timestamptz NOT NULL DEFAULT now()
);
CREATE INDEX timeline_box_idx ON public.timeline_events(proof_box_id, created_at);
GRANT SELECT, INSERT ON public.timeline_events TO authenticated;
GRANT ALL ON public.timeline_events TO service_role;
ALTER TABLE public.timeline_events ENABLE ROW LEVEL SECURITY;

CREATE TABLE public.amendments (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  proof_box_id uuid NOT NULL REFERENCES public.proof_boxes(id) ON DELETE CASCADE,
  created_by uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  reason text NOT NULL,
  previous_data jsonb NOT NULL DEFAULT '{}'::jsonb,
  new_data jsonb NOT NULL DEFAULT '{}'::jsonb,
  created_at timestamptz NOT NULL DEFAULT now()
);
CREATE INDEX amendments_box_idx ON public.amendments(proof_box_id);
GRANT SELECT, INSERT ON public.amendments TO authenticated;
GRANT ALL ON public.amendments TO service_role;
ALTER TABLE public.amendments ENABLE ROW LEVEL SECURITY;

CREATE TABLE public.notifications (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  proof_box_id uuid REFERENCES public.proof_boxes(id) ON DELETE CASCADE,
  type text NOT NULL,
  title text NOT NULL,
  message text,
  read boolean NOT NULL DEFAULT false,
  created_at timestamptz NOT NULL DEFAULT now()
);
CREATE INDEX notifications_user_idx ON public.notifications(user_id, created_at DESC);
GRANT SELECT, INSERT, UPDATE, DELETE ON public.notifications TO authenticated;
GRANT ALL ON public.notifications TO service_role;
ALTER TABLE public.notifications ENABLE ROW LEVEL SECURITY;

CREATE OR REPLACE FUNCTION public.can_access_box(_box uuid)
RETURNS boolean LANGUAGE sql STABLE SECURITY DEFINER SET search_path = public AS $$
  SELECT EXISTS (SELECT 1 FROM public.proof_boxes b WHERE b.id = _box AND b.creator_id = auth.uid())
      OR EXISTS (
        SELECT 1 FROM public.participants p
        WHERE p.proof_box_id = _box
          AND (p.user_id = auth.uid()
               OR lower(p.invite_email) = lower(coalesce((auth.jwt() ->> 'email'), '~none~')))
      );
$$;

CREATE OR REPLACE FUNCTION public.is_box_creator(_box uuid)
RETURNS boolean LANGUAGE sql STABLE SECURITY DEFINER SET search_path = public AS $$
  SELECT EXISTS (SELECT 1 FROM public.proof_boxes b WHERE b.id = _box AND b.creator_id = auth.uid());
$$;

CREATE OR REPLACE FUNCTION public.shares_box_with(_other uuid)
RETURNS boolean LANGUAGE sql STABLE SECURITY DEFINER SET search_path = public AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.participants a
    JOIN public.participants b ON a.proof_box_id = b.proof_box_id
    WHERE a.user_id = auth.uid() AND b.user_id = _other
  );
$$;

CREATE POLICY profiles_select_self ON public.profiles FOR SELECT TO authenticated
  USING (id = auth.uid() OR public.shares_box_with(id));
CREATE POLICY profiles_insert_self ON public.profiles FOR INSERT TO authenticated WITH CHECK (id = auth.uid());
CREATE POLICY profiles_update_self ON public.profiles FOR UPDATE TO authenticated USING (id = auth.uid()) WITH CHECK (id = auth.uid());

CREATE POLICY boxes_select ON public.proof_boxes FOR SELECT TO authenticated USING (public.can_access_box(id));
CREATE POLICY boxes_insert ON public.proof_boxes FOR INSERT TO authenticated WITH CHECK (creator_id = auth.uid());
CREATE POLICY boxes_update ON public.proof_boxes FOR UPDATE TO authenticated USING (public.can_access_box(id)) WITH CHECK (public.can_access_box(id));
CREATE POLICY boxes_delete ON public.proof_boxes FOR DELETE TO authenticated USING (creator_id = auth.uid() AND status = 'draft');

CREATE POLICY participants_select ON public.participants FOR SELECT TO authenticated USING (public.can_access_box(proof_box_id));
CREATE POLICY participants_insert ON public.participants FOR INSERT TO authenticated WITH CHECK (public.is_box_creator(proof_box_id));
CREATE POLICY participants_update ON public.participants FOR UPDATE TO authenticated
  USING (user_id = auth.uid() OR public.is_box_creator(proof_box_id))
  WITH CHECK (user_id = auth.uid() OR public.is_box_creator(proof_box_id));
CREATE POLICY participants_delete ON public.participants FOR DELETE TO authenticated USING (public.is_box_creator(proof_box_id));

CREATE POLICY evidence_select ON public.evidence FOR SELECT TO authenticated USING (public.can_access_box(proof_box_id));
CREATE POLICY evidence_insert ON public.evidence FOR INSERT TO authenticated WITH CHECK (public.can_access_box(proof_box_id) AND uploaded_by = auth.uid());
CREATE POLICY evidence_delete ON public.evidence FOR DELETE TO authenticated USING (uploaded_by = auth.uid());

CREATE POLICY timeline_select ON public.timeline_events FOR SELECT TO authenticated USING (public.can_access_box(proof_box_id));
CREATE POLICY timeline_insert ON public.timeline_events FOR INSERT TO authenticated WITH CHECK (public.can_access_box(proof_box_id));

CREATE POLICY amendments_select ON public.amendments FOR SELECT TO authenticated USING (public.can_access_box(proof_box_id));
CREATE POLICY amendments_insert ON public.amendments FOR INSERT TO authenticated WITH CHECK (public.can_access_box(proof_box_id) AND created_by = auth.uid());

CREATE POLICY notifications_select ON public.notifications FOR SELECT TO authenticated USING (user_id = auth.uid());
CREATE POLICY notifications_update ON public.notifications FOR UPDATE TO authenticated USING (user_id = auth.uid()) WITH CHECK (user_id = auth.uid());
CREATE POLICY notifications_delete ON public.notifications FOR DELETE TO authenticated USING (user_id = auth.uid());
CREATE POLICY notifications_insert ON public.notifications FOR INSERT TO authenticated WITH CHECK (user_id = auth.uid());

CREATE OR REPLACE FUNCTION public.lock_confirmed_record() RETURNS trigger LANGUAGE plpgsql SET search_path = public AS $$
BEGIN
  IF OLD.status IN ('confirmed','completed','disputed') THEN
    IF NEW.title IS DISTINCT FROM OLD.title
       OR NEW.type IS DISTINCT FROM OLD.type
       OR NEW.description IS DISTINCT FROM OLD.description
       OR NEW.terms IS DISTINCT FROM OLD.terms
       OR NEW.responsibilities IS DISTINCT FROM OLD.responsibilities
       OR NEW.amount IS DISTINCT FROM OLD.amount
       OR NEW.currency IS DISTINCT FROM OLD.currency
       OR NEW.start_date IS DISTINCT FROM OLD.start_date
       OR NEW.due_date IS DISTINCT FROM OLD.due_date THEN
      RAISE EXCEPTION 'This record is confirmed. Create an amendment instead of editing the original details.';
    END IF;
  END IF;
  RETURN NEW;
END; $$;
CREATE TRIGGER proof_boxes_lock BEFORE UPDATE ON public.proof_boxes FOR EACH ROW EXECUTE FUNCTION public.lock_confirmed_record();

CREATE OR REPLACE FUNCTION public.notify_box_participants(_box uuid, _type text, _title text, _message text, _skip uuid)
RETURNS void LANGUAGE plpgsql SECURITY DEFINER SET search_path = public AS $$
BEGIN
  INSERT INTO public.notifications (user_id, proof_box_id, type, title, message)
  SELECT DISTINCT u.user_id, _box, _type, _title, _message
  FROM (
    SELECT creator_id AS user_id FROM public.proof_boxes WHERE id = _box
    UNION
    SELECT user_id FROM public.participants WHERE proof_box_id = _box AND user_id IS NOT NULL
  ) u
  WHERE u.user_id IS NOT NULL AND (_skip IS NULL OR u.user_id <> _skip);
END; $$;
GRANT EXECUTE ON FUNCTION public.notify_box_participants(uuid,text,text,text,uuid) TO authenticated;

CREATE OR REPLACE FUNCTION public.on_participant_confirmed() RETURNS trigger LANGUAGE plpgsql SECURITY DEFINER SET search_path = public AS $$
DECLARE pending int; box public.proof_boxes%ROWTYPE; who text;
BEGIN
  IF NEW.confirmation_status = OLD.confirmation_status THEN RETURN NEW; END IF;
  SELECT * INTO box FROM public.proof_boxes WHERE id = NEW.proof_box_id;
  who := coalesce(NEW.display_name, NEW.invite_email, 'A participant');

  IF NEW.confirmation_status = 'confirmed' THEN
    INSERT INTO public.timeline_events (proof_box_id, actor_id, actor_name, event_type, description)
    VALUES (NEW.proof_box_id, NEW.user_id, who, 'confirmed', who || ' confirmed the agreement details');
    PERFORM public.notify_box_participants(NEW.proof_box_id, 'confirmed', who || ' confirmed ' || box.title, 'A participant confirmed the agreement details.', NEW.user_id);

    SELECT count(*) INTO pending FROM public.participants
      WHERE proof_box_id = NEW.proof_box_id AND confirmation_status <> 'confirmed';
    IF pending = 0 AND box.status IN ('draft','awaiting_confirmation') THEN
      UPDATE public.proof_boxes SET status = 'confirmed' WHERE id = NEW.proof_box_id;
      INSERT INTO public.timeline_events (proof_box_id, actor_id, actor_name, event_type, description)
      VALUES (NEW.proof_box_id, NEW.user_id, who, 'box_confirmed', 'Confirmed by all participants. The original details are now preserved.');
      PERFORM public.notify_box_participants(NEW.proof_box_id, 'box_confirmed', box.title || ' is confirmed', 'All participants have confirmed this record.', NULL);
    END IF;
  ELSIF NEW.confirmation_status = 'changes_requested' THEN
    INSERT INTO public.timeline_events (proof_box_id, actor_id, actor_name, event_type, description)
    VALUES (NEW.proof_box_id, NEW.user_id, who, 'changes_requested', who || ' requested changes: ' || coalesce(NEW.change_request, 'no details given'));
    PERFORM public.notify_box_participants(NEW.proof_box_id, 'changes_requested', who || ' requested changes', coalesce(NEW.change_request,''), NEW.user_id);
  END IF;
  RETURN NEW;
END; $$;
CREATE TRIGGER participants_confirmation AFTER UPDATE ON public.participants FOR EACH ROW EXECUTE FUNCTION public.on_participant_confirmed();

CREATE OR REPLACE FUNCTION public.on_evidence_added() RETURNS trigger LANGUAGE plpgsql SECURITY DEFINER SET search_path = public AS $$
DECLARE who text; t text;
BEGIN
  SELECT coalesce(full_name, email, 'Someone') INTO who FROM public.profiles WHERE id = NEW.uploaded_by;
  SELECT title INTO t FROM public.proof_boxes WHERE id = NEW.proof_box_id;
  INSERT INTO public.timeline_events (proof_box_id, actor_id, actor_name, event_type, description)
  VALUES (NEW.proof_box_id, NEW.uploaded_by, who, 'evidence', coalesce(who,'Someone') || ' added evidence: ' || NEW.file_name);
  PERFORM public.notify_box_participants(NEW.proof_box_id, 'evidence', 'New evidence on ' || coalesce(t,'a record'), NEW.file_name, NEW.uploaded_by);
  RETURN NEW;
END; $$;
CREATE TRIGGER evidence_added AFTER INSERT ON public.evidence FOR EACH ROW EXECUTE FUNCTION public.on_evidence_added();

CREATE OR REPLACE FUNCTION public.on_amendment_created() RETURNS trigger LANGUAGE plpgsql SECURITY DEFINER SET search_path = public AS $$
DECLARE who text; t text;
BEGIN
  SELECT coalesce(full_name, email, 'Someone') INTO who FROM public.profiles WHERE id = NEW.created_by;
  SELECT title INTO t FROM public.proof_boxes WHERE id = NEW.proof_box_id;
  INSERT INTO public.timeline_events (proof_box_id, actor_id, actor_name, event_type, description)
  VALUES (NEW.proof_box_id, NEW.created_by, who, 'amended', 'Amendment recorded: ' || NEW.reason);
  PERFORM public.notify_box_participants(NEW.proof_box_id, 'amended', 'Amendment on ' || coalesce(t,'a record'), NEW.reason, NEW.created_by);
  RETURN NEW;
END; $$;
CREATE TRIGGER amendment_created AFTER INSERT ON public.amendments FOR EACH ROW EXECUTE FUNCTION public.on_amendment_created();

CREATE OR REPLACE FUNCTION public.invite_participant(_box uuid, _email text, _role text, _name text)
RETURNS public.participants LANGUAGE plpgsql SECURITY DEFINER SET search_path = public AS $$
DECLARE existing uuid; prow public.participants; t text;
BEGIN
  IF NOT public.is_box_creator(_box) THEN RAISE EXCEPTION 'Only the record creator can invite participants.'; END IF;
  SELECT id INTO existing FROM auth.users WHERE lower(email) = lower(_email) LIMIT 1;
  INSERT INTO public.participants (proof_box_id, user_id, invite_email, display_name, role)
  VALUES (_box, existing, lower(_email), coalesce(nullif(_name,''), _email), coalesce(nullif(_role,''), 'participant'))
  RETURNING * INTO prow;
  SELECT title INTO t FROM public.proof_boxes WHERE id = _box;
  UPDATE public.proof_boxes SET status = 'awaiting_confirmation' WHERE id = _box AND status = 'draft';
  INSERT INTO public.timeline_events (proof_box_id, actor_id, actor_name, event_type, description)
  VALUES (_box, auth.uid(), NULL, 'invited', coalesce(nullif(_name,''), _email) || ' was invited to review and confirm');
  IF existing IS NOT NULL THEN
    INSERT INTO public.notifications (user_id, proof_box_id, type, title, message)
    VALUES (existing, _box, 'invited', 'You were invited to ' || coalesce(t,'a record'), 'Review the agreement and confirm the details.');
  END IF;
  RETURN prow;
END; $$;
GRANT EXECUTE ON FUNCTION public.invite_participant(uuid,text,text,text) TO authenticated;

CREATE OR REPLACE FUNCTION public.claim_invitation(_token uuid)
RETURNS uuid LANGUAGE plpgsql SECURITY DEFINER SET search_path = public AS $$
DECLARE p public.participants;
BEGIN
  SELECT * INTO p FROM public.participants WHERE invite_token = _token;
  IF p.id IS NULL THEN RAISE EXCEPTION 'This invitation link is not valid.'; END IF;
  IF p.user_id IS NULL THEN
    UPDATE public.participants SET user_id = auth.uid() WHERE id = p.id;
    INSERT INTO public.timeline_events (proof_box_id, actor_id, actor_name, event_type, description)
    VALUES (p.proof_box_id, auth.uid(), p.display_name, 'invitation_accepted', coalesce(p.display_name,'A participant') || ' opened the invitation');
  ELSIF p.user_id <> auth.uid() THEN
    RAISE EXCEPTION 'This invitation belongs to another account.';
  END IF;
  RETURN p.proof_box_id;
END; $$;
GRANT EXECUTE ON FUNCTION public.claim_invitation(uuid) TO authenticated;

CREATE OR REPLACE FUNCTION public.verify_proof_box(_code text)
RETURNS TABLE (code text, status text, created_at timestamptz, participant_count int, confirmed_count int)
LANGUAGE sql STABLE SECURITY DEFINER SET search_path = public AS $$
  SELECT b.code, b.status, b.created_at,
    (SELECT count(*)::int FROM public.participants p WHERE p.proof_box_id = b.id),
    (SELECT count(*)::int FROM public.participants p WHERE p.proof_box_id = b.id AND p.confirmation_status = 'confirmed')
  FROM public.proof_boxes b WHERE upper(b.code) = upper(_code);
$$;
GRANT EXECUTE ON FUNCTION public.verify_proof_box(text) TO anon, authenticated;

CREATE POLICY evidence_read ON storage.objects FOR SELECT TO authenticated
  USING (bucket_id = 'evidence' AND public.can_access_box(((storage.foldername(name))[1])::uuid));
CREATE POLICY evidence_write ON storage.objects FOR INSERT TO authenticated
  WITH CHECK (bucket_id = 'evidence' AND public.can_access_box(((storage.foldername(name))[1])::uuid));
CREATE POLICY evidence_remove ON storage.objects FOR DELETE TO authenticated
  USING (bucket_id = 'evidence' AND owner = auth.uid());
CREATE POLICY avatar_read ON storage.objects FOR SELECT TO authenticated USING (bucket_id = 'avatars');
CREATE POLICY avatar_write ON storage.objects FOR INSERT TO authenticated
  WITH CHECK (bucket_id = 'avatars' AND (storage.foldername(name))[1] = auth.uid()::text);
CREATE POLICY avatar_update ON storage.objects FOR UPDATE TO authenticated
  USING (bucket_id = 'avatars' AND (storage.foldername(name))[1] = auth.uid()::text);
CREATE POLICY avatar_delete ON storage.objects FOR DELETE TO authenticated
  USING (bucket_id = 'avatars' AND (storage.foldername(name))[1] = auth.uid()::text);
