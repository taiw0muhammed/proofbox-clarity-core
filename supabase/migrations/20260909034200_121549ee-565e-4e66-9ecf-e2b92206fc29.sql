GRANT EXECUTE ON FUNCTION public.can_access_box(uuid) TO authenticated;
GRANT EXECUTE ON FUNCTION public.is_box_creator(uuid) TO authenticated;
GRANT EXECUTE ON FUNCTION public.shares_box_with(uuid) TO authenticated;

DROP POLICY IF EXISTS "evidence_files_select" ON storage.objects;
DROP POLICY IF EXISTS "evidence_files_insert" ON storage.objects;
DROP POLICY IF EXISTS "evidence_files_delete" ON storage.objects;
DROP POLICY IF EXISTS "avatar_files_all" ON storage.objects;

CREATE POLICY "evidence_files_select" ON storage.objects FOR SELECT TO authenticated
USING (bucket_id = 'evidence' AND public.can_access_box(((storage.foldername(name))[1])::uuid));

CREATE POLICY "evidence_files_insert" ON storage.objects FOR INSERT TO authenticated
WITH CHECK (bucket_id = 'evidence' AND owner = auth.uid() AND public.can_access_box(((storage.foldername(name))[1])::uuid));

CREATE POLICY "evidence_files_delete" ON storage.objects FOR DELETE TO authenticated
USING (bucket_id = 'evidence' AND owner = auth.uid());

CREATE POLICY "avatar_files_all" ON storage.objects FOR ALL TO authenticated
USING (bucket_id = 'avatars' AND (storage.foldername(name))[1] = auth.uid()::text)
WITH CHECK (bucket_id = 'avatars' AND (storage.foldername(name))[1] = auth.uid()::text);