import { redirect } from 'next/navigation';

export default function MockExamRedirect() {
  redirect('/mock-test');
}
