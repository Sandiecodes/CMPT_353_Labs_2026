import React, { useState } from 'react';
import QuestionForm from './AddQuestions';
import QuestionList from './ShowQuestions';

const App = () => {
  const [updateList, setUpdateList] = useState(false);

  const handleAddQuestion = () => {
    // Set the flag to update the question list
    setUpdateList(!updateList);
  };

  return (
    <div>
      <h1>Question Management</h1>
      <QuestionForm onAddQuestion={handleAddQuestion} />
      <QuestionList key={updateList} />
    </div>
  );
};

export default App;
