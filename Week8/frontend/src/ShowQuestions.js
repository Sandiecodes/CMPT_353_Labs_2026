import React, { useState, useEffect } from 'react';
import axios from 'axios';

const QuestionList = () => {
  const [questions, setQuestions] = useState([]);

  useEffect(() => {
    axios.get('http://localhost:8080/questions')
      .then(res => setQuestions(res.data))
      .catch(error => console.error(error));
  }, []);

  return (
    <div>
      <h2>Question List</h2>
      <table border="1" cellPadding="8" cellSpacing="0">
        <thead>
          <tr>
            <th>Question</th>
            <th>Response</th>
          </tr>
        </thead>
        <tbody>
          {questions.length > 0 ? (
            questions.map((question, index) => (
              <tr key={index}>
                <td>{question.question}</td>
                <td>{question.response}</td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="2" style={{ textAlign: 'center' }}>No questions found</td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
};

export default QuestionList;
