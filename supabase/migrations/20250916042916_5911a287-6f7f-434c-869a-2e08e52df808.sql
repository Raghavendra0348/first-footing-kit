-- Add delete policy for civic_reports to allow admins to delete reports
CREATE POLICY "Admins can delete reports" 
ON public.civic_reports 
FOR DELETE 
USING (EXISTS ( 
  SELECT 1 
  FROM profiles 
  WHERE profiles.user_id = auth.uid() 
  AND profiles.full_name ILIKE '%admin%'
));