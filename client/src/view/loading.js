
import React from 'react'
import {LoadingOutlined} from "@ant-design/icons";

export default function Loading() {
    return (
        <>
            <div style={{display: 'flex', alignItems:'center', justifyContent: 'center', height: '100vh'}}>
                <LoadingOutlined style={{ fontSize: '50px', color: '#ffd400' }} />
            </div>

        </>
    )
}