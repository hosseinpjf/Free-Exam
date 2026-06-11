import { useParams } from "react-router-dom"
import { useGetExamUsers } from "services/question";

function ExamPage() {
    const { examId } = useParams();
    const { data } = useGetExamUsers(examId);
    console.log(data);
    return (
        <div>
            <h2>ExamPage</h2>
            <ul>
                {data?.map(id => (
                    <li key={id}>{id}</li>
                ))}
            </ul>
        </div>
    )
}

export default ExamPage