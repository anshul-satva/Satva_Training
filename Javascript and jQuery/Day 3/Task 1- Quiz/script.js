$(document).ready(function () {
 
  // QUIZ DATA 
  const questions = [
    {
      question: "What does HTML stand for?",
      type: "radio",
      options: [
        "Hyper Text Markup Language",
        "High Text Machine Language",
        "Hyper Tool Multi Language",
        "Hyper Tool Machine Language",
      ],
      answer: "Hyper Text Markup Language",
    },
    {
      question: "Which symbol is used for IDs in CSS?",
      type: "text",
      answer: "#",
    },
    {
      question:
        "Which keyword is used to declare a block-scoped variable in JavaScript?",
      type: "radio",
      options: ["var", "let", "const", "define"],
      answer: "let",
    },
    {
      question: "What keyword is used to declare a constant in JavaScript?",
      type: "text",
      answer: "const",
    },
    {
      question: "Which library is used for DOM manipulation?",
      type: "radio",
      options: ["Bootstrap", "jQuery", "React"],
      answer: "jQuery",
    },
  ];

  let currentIndex = 0;
  let score = 0;
  let userResponses = [];

 
  // LOAD QUESTION 
  function loadQuestion() {
    $("#errorMsg").hide();
    // $('#feedback').hide();

    const currentQuestion = questions[currentIndex];

    $("#questionNumber").text(
      `Question ${currentIndex + 1} of ${questions.length}`
    );
    $("#questionText").text(currentQuestion.question);
    $("#answerArea").empty();

    if (currentQuestion.type === "radio") {
      currentQuestion.options.forEach((option) => {
        $("#answerArea").append(`
                    <label>
                        <input type="radio" name="answer" value="${option}"> ${option}
                    </label>
                `);
      });
    } else {
      $("#answerArea").append(`
                <input type="text" id="textAnswer" placeholder="Enter your answer">
            `);
    }
  }

 
  // VALIDATION 
  function validateAnswer() {
    const currentQuestion = questions[currentIndex];

    if (currentQuestion.type === "radio") {
      if ($('input[name="answer"]:checked').length === 0) {
        showError();
        return false;
      }
    } else {
      if ($("#textAnswer").val().trim() === "") {
        showError();
        return false;
      }
    }
    return true;
  }

  function showError() {
    $("#errorMsg").fadeIn().delay(1000).fadeOut();
  }

 
  // CHECK ANSWER 
  function checkAnswer() {
    const currentQuestion = questions[currentIndex];
    let userAnswer;

    if (currentQuestion.type === "radio") {
      userAnswer = $('input[name="answer"]:checked').val();
    } else {
      userAnswer = $("#textAnswer").val().trim();
    }

    const isCorrect =
      userAnswer.toLowerCase() === currentQuestion.answer.toLowerCase();

    if (isCorrect) {
      score++;
    }

    // Store response
    userResponses.push({
      question: currentQuestion.question,
      userAnswer: userAnswer,
      correctAnswer: currentQuestion.answer,
      isCorrect: isCorrect,
    });

    $("#scoreDisplay").text(`Score: ${score}`);
  }
 
  // NEXT QUESTION 
  function nextQuestion() {
    setTimeout(() => {
      currentIndex++;

      if (currentIndex < questions.length) {
        $("#quizArea").fadeOut(0, function () {
          loadQuestion();
          $("#quizArea").fadeIn(300);
        });
      } else {
        showFinalScore();
      }
    }, 500);
  }

 
  // FINAL SCORE 
  function showFinalScore() {
    $("#quizArea").hide();
    $("#finalScore").fadeIn();

    $("#correct-ans").empty();
    $("#incorrect-ans").empty();

    userResponses.forEach((item, index) => {
      if (item.isCorrect) {
        $("#correct-ans").append(`
        <p>
          <strong>Q${index + 1}:</strong> ${item.question}<br>
          <span style="color:green;">Your Answer: ${item.userAnswer}</span>
        </p>
      `);
      } else {
        $("#incorrect-ans").append(`
        <p>
          <strong>Q${index + 1}:</strong> ${item.question}<br>
          <span style="color:red;">Your Answer: ${item.userAnswer}</span><br>
        </p>
      `);
      }
    });

    $("#finalResult").text(`${score} out of ${questions.length}`);
    $("#restartBtn").show();
  }

 
  // RESET QUIZ 
  function resetQuiz() {
    location.reload();
  }

 
  // EVENTS 
  $("#nextBtn").click(function () {
    if (validateAnswer()) {
      checkAnswer();
      nextQuestion();
    }
  });

  $("#restartBtn").click(function () {
    resetQuiz();
  });

  // INITIAL LOAD
  loadQuestion();
});
