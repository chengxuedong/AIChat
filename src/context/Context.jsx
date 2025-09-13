import { createContext, useState } from 'react';
import runChat from '../config/gemini';
export const Context = createContext();

const ContextProvider = (props) => {

    const [input, setInput] = useState('');
    const [recentPrompt, setRecentPrompt] = useState('');
    const [prevPrompts, setPrevPrompts] = useState([]);
    const [showResult, setShowResult] = useState(false);
    const [loading, setLoading] = useState(false);
    const [resultData, setResultData] = useState('');

    const delayPara = (index, nextword) => {
        setTimeout(function() {
            setResultData((prev) => prev + nextword);
        }, 75 * index);
    }

    const onSent = async (prompt) => {
        setResultData('')
        setLoading(true);
        setShowResult(true);
        let response;
        console.log('prompt',prompt);
        
        //判断是加载历史对话还是新输入
        if(prompt !== undefined){
            response = await runChat(prompt);
            setRecentPrompt(prompt);
            console.log(111);
            
        }else {
            setPrevPrompts((prev) => [...prev, input]);
            setRecentPrompt(input);
            response = await runChat(input);
            console.log(222);
            
            }
        //处理返回的内容，**加粗，*换行
        let responseArray = response.split('**');
        // let newResponse;如果没有像下面初始化，会在渲染内容时在内容最前面出现undefined
        let newResponse ='';
        for (let i = 0; i < responseArray.length; i++) {
            if (i === 0 || i % 2 === 0) {
                newResponse += responseArray[i];
            } else {
                newResponse += '<b>' + responseArray[i] + '</b>';
            }
        }
        let newResponse2 = newResponse.split('*').join('</br>');
        let newResponseArray = newResponse2.split(' ');
        for (let i = 0; i < newResponseArray.length; i++) {
            const nextWord = newResponseArray[i];
            delayPara(i, nextWord+' ');
        };
        setLoading(false);
        setInput(''); 
    }

    const contextValue = {
        prevPrompts,
        setPrevPrompts,
        onSent,
        recentPrompt,
        setRecentPrompt,
        showResult,
        loading,
        resultData,
        input,
        setInput
    }

    return (
        <Context.Provider value={contextValue}>
            {props.children}
        </Context.Provider>
    )
}

export default ContextProvider;