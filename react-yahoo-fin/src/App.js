import React, { useState, useEffect } from 'react';
import './App.css';
import { Button, Tabs, Progress, Menu, Radio, Input, Affix } from 'antd';
import ReactHtmlParser from 'react-html-parser';
import HistoryGraph from './HistoricGraph';
import useInterval from '@use-it/interval';
const config = require('./config');
const axios = require('axios');
const { TabPane } = Tabs;
const { SubMenu } = Menu;

function App() {
  const [tickers, settickers] = useState(null)
  const [ticker_loaded, setticker_loaded] = useState(0)
  const [ticker_radio, setticker_radio] = useState('AAPL')
  const [about_api, setabout_api] = useState(null)
  const [active_menu, setactive_menu] = useState('dow')
  const [analyst_info, setanalyst_info] = useState(null)
  const [balance_sheet, setbalance_sheet] = useState(null)
  const [cash_flow, setcash_flow] = useState(null)
  const [holder, setholder] = useState(null)
  const [income, setincome] = useState(null)
  const [quote, setquote] = useState(null)
  const [stats, setstats] = useState(null)
  const [historic_price, sethistoric_price] = useState(null)
  const [live_price, setlive_price] = useState(0)

  useEffect(() => {
    document.title = "yahoo_fin"

    //load all tickers
    axios({
      method: 'get',
      url: config.URL + 'stocks/tickers/',
      onDownloadProgress: progressEvent => {
        setticker_loaded(parseInt(progressEvent.loaded / progressEvent.total * 100))

      },
    })
      .then((response) => {
        settickers(response.data)
        console.log(response.data)
      })
      .catch((error) => {
        console.log(error)
      })
  }, [])

  useInterval(() => {
    //get live price
    axios({
      method: 'post',
      url: config.URL + 'stocks/live/',
      data: {
        'ticker': ticker_radio,
      }
    })
      .then((response) => {
        setlive_price(parseFloat(response.data['price']).toFixed(2))
      })
      .catch((error) => {
        console.log(error)
      })
  }, 1000);

  const about_yahoo_fin = () => {
    //yahoo_fin api page
    axios({
      method: 'get',
      url: config.URL + 'stocks/about_yahoo_fin/',
    })
      .then((response) => {
        setabout_api(response.data)
      })
      .catch((error) => {
        console.log(error)
      })
  }

  const get_analysts_info = () => {
    //get_analysts_info
    axios({
      method: 'post',
      url: config.URL + 'stocks/analysts/',
      data: {
        'ticker': ticker_radio,
      }
    })
      .then((response) => {
        setanalyst_info(response.data)
      })
      .catch((error) => {
        console.log(error)
      })
  }

  const get_balance_sheet = () => {
    //get_balance_sheet
    axios({
      method: 'post',
      url: config.URL + 'stocks/balance/',
      data: {
        'ticker': ticker_radio,
      }
    })
      .then((response) => {
        setbalance_sheet(response.data)
      })
      .catch((error) => {
        console.log(error)
      })
  }

  const get_cash_flow = () => {
    //get_cash_flow
    axios({
      method: 'post',
      url: config.URL + 'stocks/cash/',
      data: {
        'ticker': ticker_radio,
      }
    })
      .then((response) => {
        setcash_flow(response.data)
      })
      .catch((error) => {
        console.log(error)
      })
  }

  const get_holders = () => {
    //get_holders
    axios({
      method: 'post',
      url: config.URL + 'stocks/holder/',
      data: {
        'ticker': ticker_radio,
      }
    })
      .then((response) => {
        setholder(response.data)
      })
      .catch((error) => {
        console.log(error)
      })
  }

  const get_income_statement = () => {
    //get_income_statement
    axios({
      method: 'post',
      url: config.URL + 'stocks/income/',
      data: {
        'ticker': ticker_radio,
      }
    })
      .then((response) => {
        setincome(response.data)
      })
      .catch((error) => {
        console.log(error)
      })
  }

  const get_quote_table = () => {
    //get_quote_table
    axios({
      method: 'post',
      url: config.URL + 'stocks/quote/',
      data: {
        'ticker': ticker_radio,
      }
    })
      .then((response) => {
        setquote(response.data)
      })
      .catch((error) => {
        console.log(error)
      })
  }

  const get_stats = () => {
    //get_stats
    axios({
      method: 'post',
      url: config.URL + 'stocks/stats/',
      data: {
        'ticker': ticker_radio,
      }
    })
      .then((response) => {
        setstats(response.data)
      })
      .catch((error) => {
        console.log(error)
      })
  }

  const get_history = () => {
    //get_data
    axios({
      method: 'post',
      url: config.URL + 'stocks/history/',
      data: {
        'ticker': ticker_radio,
      }
    })
      .then((response) => {
        sethistoric_price(response.data)
        console.log(response.data)
      })
      .catch((error) => {
        console.log(error)
      })
  }

  //left tab click event
  const tabChange = (key) => {
    switch (key) {
      case '2':
        get_analysts_info()
        break
      case '3':
        about_yahoo_fin()
        break
      case '4':
        get_balance_sheet()
        break
      case '5':
        get_cash_flow()
        break
      case '6':
        get_holders()
        break
      case '7':
        get_income_statement()
        break
      case '8':
        get_quote_table()
        break
      case '9':
        get_stats()
        break
      case '10':
        get_history()
        break
      default:
        break
    }
  }
  //Tickers tab menu click event
  const menuClick = (e) => {
    setactive_menu(e.key)
  }
  //Tickers radio select event
  const radioSelect = (e) => {
    setticker_radio(e.target.value)
  }

  //Input ticker
  const tickerInput = (e) => {
    setticker_radio(e.target.value)
  }

  const startServer = () => {
    window.open('http://chuanshuoge-yahoo-fin.herokuapp.com/stocks/about_yahoo_fin/')
  }

  return (
    <div style={{ padding: '10px' }}>
      <Button block type="primary" size='small' style={{ marginBottom: '10px' }}
        onClick={() => startServer()}>
        Start Yahoo_fin Server
          </Button>

      <Tabs tabPosition='left' defaultActiveKey="1" onChange={(key) => tabChange(key)}>
        <TabPane tab="Tickers" key="1">
          <Affix offsetTop={0}>
            <span style={{ float: 'right', backgroundColor: 'white' }}>
              <Input size="small" placeholder="input ticker" style={{ width: '100px' }}
                onChange={(e) => tickerInput(e)} /> {}
              Selected ticker: {ticker_radio}</span>
          </Affix>

          Loading tickers {}
          <Progress type="circle" percent={ticker_loaded} width={20} /><br />

          <a href='http://eoddata.com/symbols.aspx' target="_blank">NYSE Tickers</a> {'| '}
          <a href='http://eoddata.com/stocklist/TSX.htm' target="_blank">TSE Tickers</a>

          <Menu onClick={(e) => menuClick(e)} selectedKeys={[active_menu]} mode='horizontal'>
            <Menu.Item key='dow'>Dow</Menu.Item>
            <Menu.Item key='nasdaq'>Nasdaq</Menu.Item>
            <Menu.Item key='sp500'>SP500</Menu.Item>
            <Menu.Item key='other'>Other</Menu.Item>
          </Menu><br />

          {tickers ?
            <Radio.Group onChange={(e) => radioSelect(e)}>
              {
                tickers[active_menu].map((item, index) => {
                  return <Radio value={item} key={index}>{item}</Radio>
                })
              }
            </Radio.Group>
            : null}
        </TabPane>
        <TabPane tab="History" key="10">
          Ticker: {ticker_radio} ${live_price}<br />
          <HistoryGraph open={historic_price ? historic_price['open'] : null}
            close={historic_price ? historic_price['close'] : null}
            high={historic_price ? historic_price['high'] : null}
            low={historic_price ? historic_price['low'] : null}
            adjclose={historic_price ? historic_price['adjclose'] : null}
            volume={historic_price ? historic_price['volume'] : null}
            date={historic_price ? historic_price['date'] : null}>
          </HistoryGraph>
        </TabPane>
        <TabPane tab="Analyst" key="2">
          Ticker: {ticker_radio} ${live_price}<br />
          <pre>{analyst_info}</pre>
        </TabPane>
        <TabPane tab="Balance" key="4">
          Ticker: {ticker_radio} ${live_price}<br />
          <pre>{balance_sheet}</pre>
        </TabPane>
        <TabPane tab="Cash" key="5">
          Ticker: {ticker_radio} ${live_price}<br />
          <pre>{cash_flow}</pre>
        </TabPane>
        <TabPane tab="Holder" key="6">
          Ticker: {ticker_radio} ${live_price}<br />
          <pre>{holder}</pre>
        </TabPane>
        <TabPane tab="Income" key="7">
          Ticker: {ticker_radio} ${live_price}<br />
          <pre>{income}</pre>
        </TabPane>
        <TabPane tab="Quote" key="8">
          Ticker: {ticker_radio} ${live_price}<br />
          <pre>{quote}</pre>
        </TabPane>
        <TabPane tab="Stats" key="9">
          Ticker: {ticker_radio} ${live_price}<br />
          <pre>{stats}</pre>
        </TabPane>
        <TabPane tab="Yahoo_fin" key="3">
          {ReactHtmlParser(about_api)}
        </TabPane>
      </Tabs>

    </div>
  );
}

export default App;
