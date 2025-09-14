import React from 'react'
import './Main.css'
import { assets } from '../../assets/assets'
import { Context } from '../../context/context'
const Main = () => {
  
    const { onSent, recentPrompt, showResult, loading, resultData, setInput, input } = React.useContext(Context)
    
    //点击Enter也可以调用onSent
    React.useEffect(() => {
        const handleKeyDown = (event) => {
            if (event.key === 'Enter' && !event.shiftKey) {
                event.preventDefault();
                onSent(input, 'new');
            }
        };
        document.addEventListener('keydown', handleKeyDown);
        return () => {
            document.removeEventListener('keydown', handleKeyDown);
        };
    }, [input, onSent]);
    return (
        <div className='main'>
            <div className="nav">
                <p>Gemini</p>
                <img src={assets.user_icon} alt="" />
            </div>
            <div className="main-container">

                {!showResult ?
                <>
                   <div className="greet">
                       <p><span>Hello,Dev.</span></p>
                       <p>How can I help you today?</p>
                   </div>
                   <div className="cards">
                            <div onClick={() => onSent('Recommend a city for a road trip on 100 words','new')} className="card">
                                <p>Recommend a city for a road trip on 100 words</p>
                           <img src={assets.compass_icon} alt="" />
                       </div>
                            <div onClick={() => onSent('please tell me a short story on 150 words','new')} className="card">
                                <p>please tell me a short story on 150 words</p>
                           <img src={assets.bulb_icon} alt="" />
                       </div>
                            <div onClick={() => onSent('Please give me some tips on how to improve my writing on 100 words','new')} className="card">
                                <p>Please give me some tips on how to improve my writing on 100 words</p>
                           <img src={assets.message_icon} alt="" />
                       </div>
                            <div onClick={() => onSent('what can eating apple bring to me on 100 words','new')} className="card">
                           <p>what can  eating apple bring to me on 100 words</p>
                           <img src={assets.code_icon} alt="" />
                       </div>
                   </div>    
                </>
                :
                    <div className='result'>
                        <div className="result-title">
                            <img src={assets.user_icon} alt="" />
                            <p>{recentPrompt}</p>
                        </div>
                        <div className="result-data">
                            <img src={assets.gemini_icon} alt="" />
                            {loading ?
                                <div className="loader">
                                    <hr />
                                    <hr />
                                    <hr />
                                </div> :
                                <p className='result-text'>{resultData}</p>}
                        </div>
                </div>}
                <div className="main-bottom">
                    <div className="search-box">
                        <input onChange={(e)=>setInput(e.target.value)} value={input} type="text" placeholder='Enter a prompt here' />
                        <div>
                            <img src={assets.gallery_icon} alt="" />
                            <img src={assets.mic_icon} alt="" />
                            {input ? <img onClick={() => { onSent(input, 'new'); }} src={assets.send_icon} alt="" /> : null}
                        </div>
                    </div>
                    <p className="bottom-info">
                        Gemini may display inaccurate info,includeing about people, so double-check its responses.
                    </p>
                </div>
            </div>
        </div>
    )
}

export default Main