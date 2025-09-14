import { createContext, useState } from 'react';
import runChat from '../config/gemini';
export const Context = createContext();

const ContextProvider = (props) => {

    const [input, setInput] = useState('');
    const [recentPrompt, setRecentPrompt] = useState('');
    const [prevPrompts, setPrevPrompts] = useState([]);
    const [showResult, setShowResult] = useState(false);
    const [loading, setLoading] = useState(false);
    const [resultData, setResultData] = useState([]);

    /* 逐 token 插入，token 可能是单词、空格、<br/>、<b>…</b> */
    const streamTokens = (tokens) => {
        tokens.forEach((tok, i) => {
            setTimeout(() => {
                setResultData(prev => [...prev, tok]);
            }, 75 * i);
        });
    };

    /* 把原始文本切成 React 节点数组，同时保留空格、处理 **bold** 和 *break* */
    const parseResponse = (text) => {
        // 1. 把连续 \n 压缩成两个（即只留一行空白）
        const trimmed = text.trim().replace(/\n{2,}/g, '\n\n');

        // 2. 按「段」拆开，段与段之间插入一个 <br />
        const paragraphs = trimmed.split('\n\n').map(p => p.replace(/\n/g, ' ')); // 段内换行→空格

        const nodes = [];
        paragraphs.forEach((para, idx) => {
            if (idx > 0) nodes.push(<br key={`gap-${idx}`} />); // 段落空行

            // 3. 逐词包 span
            para.split(/(\s+)/).filter(Boolean).forEach((tok, i) => {
                if (tok === ' ') tok = '\u00A0'; // 防止合并
                nodes.push(
                    <span key={`${idx}-${i}`} className="fade-in-word">
                        {tok}
                    </span>
                );
            });
        });
        return nodes;
    };

    const newChat = () => {
        setLoading(false);
        setShowResult(false);
        setResultData([]);
    }

    const onSent = async (prompt, status) => {
        setInput('');
        setResultData([]);
        setLoading(true);
        setShowResult(true);
        if (status === 'new') setPrevPrompts(prev => [...prev, prompt]);
        setRecentPrompt(prompt);

        //捕获错误，防止api过期或者大模型超载报错
        const response = await runChat(prompt).catch((err) => {
            console.error('Error during runChat:', err);
            setLoading(false);
            setResultData([<span key="error" style={{ color: 'red' }}>Error: {err.message}</span>]);
        });
        
        if (response) {
            const tokens = parseResponse(response);
            streamTokens(tokens);
            setLoading(false);
        }
    };

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
        setInput,
        newChat
    }

    return (
        <Context.Provider value={contextValue}>
            {props.children}
        </Context.Provider>
    )
}

export default ContextProvider;