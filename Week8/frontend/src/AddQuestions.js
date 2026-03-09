import React, { useState } from 'react';
import axios from 'axios';

const QuestionForm = ({ onAddQuestion }) => {
  const [question, setQuestion] = useState('');
  const [response, setResponse] = useState('');

  const addQuestion = () => {
    axios.post('http://localhost:8080/questions', { question, response })
      .then(res => {
        console.log(res.data);
        onAddQuestion();
      })
      .catch(error => console.error(error));
  };

  return (
    <div>
      <h2>Add Question</h2>
      <label>
        Question:
        <input type="text" value={question} onChange={e => setQuestion(e.target.value)} />
      </label>
      <label>
        Response:
        <input type="text" value={response} onChange={e => setResponse(e.target.value)} />
      </label>
      <button onClick={addQuestion}>Add Question</button>
    </div>
  );
};

export default QuestionForm;
