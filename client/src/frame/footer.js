import React, {memo} from "react";
import {Divider} from "antd";
import thx from './theme.less'
import {friends, icp, organizer} from "@.router/list";

function FrameFooter(){
    return (
        <>
            <Divider />
            <div className={thx.footer}>
                {friends.map((item, index) => (
                    <span key={`friend${index}`}>
                        { (index > 0) && <span className={thx.symbol}> &nbsp;|&nbsp;</span> }
                        <a href={item.href} target="_blank" rel="noopener noreferrer">{item.name}</a>
                    </span>
                )) }
            </div>
            <div className={thx.footer}>
                工业和信息化部备案管理系统网站 {icp}
            </div>
            <div className={thx.footer}>
                主办单位：{organizer}
            </div>
        </>
    )
}


export default memo(FrameFooter)