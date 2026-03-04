import React, { useMemo, useState } from "react";

const QUESTIONS = [
  "Do your core processes follow a clearly defined workflow?",
  "Are procedures documented and easy for team members to follow?",
  "Is it clear who is responsible for each operational task?",
  "Do you have structured reporting to monitor performance?"
];

export default function App() {
  const [step, setStep] = useState(0);
  const [answers, setAnswers] = useState([]);

  const score = useMemo(() => {
    if (!answers.length) return 0;
    return Math.round((answers.reduce((a,b)=>a+b,0)/(answers.length*5))*100);
  }, [answers]);

  function answer(v){
    setAnswers([...answers,v]);
    setStep(step+1);
  }

  if(step===0){
    return(
      <div style={{padding:40,fontFamily:"Arial"}}>
        <h1>Operational Maturity Index</h1>
        <p>
        Assess the maturity of your organisation’s operations across workflow,
        documentation, roles and reporting.
        </p>
        <button onClick={()=>setStep(1)}>Start Assessment</button>
      </div>
    )
  }

  if(step<=QUESTIONS.length){
    const q=QUESTIONS[step-1];

    return(
      <div style={{padding:40,fontFamily:"Arial"}}>
        <h2>{q}</h2>

        {[1,2,3,4,5].map(v=>(
          <button
            key={v}
            style={{margin:10,padding:"10px 20px"}}
            onClick={()=>answer(v)}
          >
            {v}
          </button>
        ))}
      </div>
    )
  }

  return(
    <div style={{padding:40,fontFamily:"Arial"}}>
      <h1>Your Operational Maturity Score</h1>

      <div style={{
        width:300,
        height:20,
        background:"#ddd",
        marginBottom:20
      }}>
        <div style={{
          width:`${score}%`,
          height:"100%",
          background:"#555746"
        }}/>
      </div>

      <h2>{score}%</h2>

      {score<40 && <p>Your operations are reactive and lack structure.</p>}
      {score>=40 && score<70 && <p>Your operations have some structure but need refinement.</p>}
      {score>=70 && <p>Your operations are structured and scalable.</p>}
    </div>
  )
}