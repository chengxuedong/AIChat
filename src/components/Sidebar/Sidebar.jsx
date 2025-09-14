import React, { useState, useContext } from 'react'
import './Sidebar.css'
import { assets } from '../../assets/assets'
import { Context } from '../../context/context'
const Sidebar = () => {
    // const [extended, setExtended] = React.useState(false)
    const [extended, setExtended] = useState(true)
    const {onSent,prevPrompts,setRecentPrompt,newChat} = useContext(Context);
    //加载历史对话
    const loadPrompt = async(prompt) => {
        setRecentPrompt(prompt);
        await onSent(prompt);
    }
  
    return (
    <div className='sidebar'>
          <div className="top">
            <img onClick={()=>setExtended(prev=>!prev)} className='menu' src={assets.menu_icon} alt="" />
              <div onClick={()=>newChat()} className="new-chat">
                  <img src={assets.plus_icon} alt="" />
                  {extended ? <p>New Chat</p> : null}
              </div>
            {extended ?
            <div className="recent">
              <p className="recent-title">Recent</p>
              {/* 显示最近的对话 */}
              {
                prevPrompts.map((item, index) => {
                  return (
                    <div key={index} onClick={()=>loadPrompt(item)} className="recent-entry">
                      <img src={assets.message_icon} alt="" />
                      {/* 只显示18个字符  */}
                      <p>{item.slice(0,18)}...</p>
                    </div>
                  )
                    })}
            </div>
            : null}
          </div>
          <div className="bottom">
              <div className="bottom-item recent-entry">
                  <img src={assets.question_icon} alt="" />
                  {extended ? <p>Help</p> : null}
              </div>
              <div className="bottom-item recent-entry">
                  <img src={assets.history_icon} alt="" />
                  {extended ? <p>Activity</p> : null}
              </div>
              <div className="bottom-item recent-entry">
                  <img src={assets.setting_icon} alt="" />
                  {extended ? <p>Setting</p> : null}
              </div>
          </div>
    </div>
  )
}

export default Sidebar