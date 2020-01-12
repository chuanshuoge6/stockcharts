import React, { useState, useEffect } from 'react';
import Kaji from './Kaji'
import HeikinAshi from './Heikin'
import CandleStickChartWithMACDIndicator from './MACD'
import CandleStickChartWithRSIIndicator from './RSI_ATR'
import { Menu } from 'antd';

function HistoryGraph(props) {
    const { open, close, high, low, adjclose, volume, date } = props
    const [data, setdata] = useState(null)
    const [menu_select, setmenu_select] = useState('macd')

    useEffect(() => {
        if (adjclose) {
            let ohlc = []
            let i = 0
            while (i < adjclose.length) {
                //old date format %m/%d/%Y
                const old_date = date[i].split('/')
                ohlc.push(
                    {
                        'open': open[i],
                        'close': close[i],
                        'volume': volume[i],
                        'high': high[i],
                        'low': low[i],
                        //new date format y,m,d
                        'date': new Date(parseInt(old_date[2]), parseInt(old_date[0]) - 1, old_date[1])
                    }
                )
                i++
            }
            setdata(ohlc)
        }
    }, [props])

    const menuClick = (e) => {
        setmenu_select(e.key)
    }

    return (
        <div>
            <Menu onClick={(e) => menuClick(e)} selectedKeys={[menu_select]} mode="horizontal">
                <Menu.Item key="kagi">
                    Kagi
        </Menu.Item>
                <Menu.Item key="heikin">
                    Heikin
        </Menu.Item>
                <Menu.Item key="macd">
                    MACD
        </Menu.Item>
                <Menu.Item key="rsi_atr">
                    RSI ATR
        </Menu.Item>
            </Menu>
            {data && menu_select == 'kagi' ?
                <Kaji data={data} width={1000} ratio={1} type='svg'></Kaji>
                : null}
            {data && menu_select == 'heikin' ?
                <HeikinAshi data={data} width={1000} ratio={1} type='svg'></HeikinAshi>
                : null}
            {data && menu_select == 'macd' ?
                <CandleStickChartWithMACDIndicator data={data} width={1000} ratio={1} type='svg'></CandleStickChartWithMACDIndicator>
                : null}
            {data && menu_select == 'rsi_atr' ?
                <CandleStickChartWithRSIIndicator data={data} width={1000} ratio={1} type='svg'></CandleStickChartWithRSIIndicator>
                : null}
        </div>
    );
}

export default HistoryGraph;