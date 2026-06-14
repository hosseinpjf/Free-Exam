import { useGetExamsLength, useGetQuestionsLength, useGetUsersLength } from "services/question"
import Loader from "components/modules/Loader";

function HomePage() {
  const { data: questionsLength, isPending: pendingQuestionsLength } = useGetQuestionsLength();
  const { data: usersLength, isPending: pendingUsersLength } = useGetUsersLength();
  const { data: examsLength, isPending: pendingExamsLength } = useGetExamsLength();

  if (pendingQuestionsLength || pendingUsersLength || pendingExamsLength) return <Loader position='centerLoader' />
  return (
    <div>
      <h2 className="title">Home Page</h2>
      <div style={{ display: "flex", justifyContent: "space-around", alignItems: 'center', flexWrap: 'wrap', gap: '40px' }}>
        <p className="boxShadow" style={{ fontWeight: 'bold', padding: '10px 20px' }}>Number of questions:
          <span style={{ color: '#fff' }}> {questionsLength}</span>
        </p>
        <p className="boxShadow" style={{ fontWeight: 'bold', padding: '10px 20px' }}>Number of users:
          <span style={{ color: '#fff' }}> {usersLength}</span>
        </p>
        <p className="boxShadow" style={{ fontWeight: 'bold', padding: '10px 20px' }}>Number of exams:
          <span style={{ color: '#fff' }}> {examsLength}</span>
        </p>
      </div>
    </div>
  )
}

export default HomePage