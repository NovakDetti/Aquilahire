import McqInterviewClient from "./McqInterviewClient";

type PageProps = {
  params: Promise<{ id: string }>; 
};

export default async function InterviewPage({ params }: PageProps) {
  const { id } = await params;  

  return <McqInterviewClient interviewId={id} />;
}
