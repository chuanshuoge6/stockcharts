from django.http import  HttpResponse
from yahoo_fin import stock_info as si
from django.views.decorators.csrf import csrf_exempt
import io
import json
import numpy as np
from contextlib import redirect_stdout
import pandas as pd

pd.set_option('display.max_rows', None)
pd.set_option('display.max_columns', None)
pd.set_option('display.width', None)
pd.set_option('display.max_colwidth', -1)

@csrf_exempt
def tickers(request):
    dow = si.tickers_dow()
    nasdaq = si.tickers_nasdaq()
    sp500 = si.tickers_sp500()
    other = si.tickers_other()

    all = json.dumps({'dow': dow,
                         'nasdaq': nasdaq,
                         'sp500': sp500,
                         'other': other})

    return HttpResponse(all)

@csrf_exempt
def history(request):
    ticker = json.loads(request.body)['ticker']

    if not ticker:
        return HttpResponse('ticker not received')
    else:
        info = si.get_data(ticker)

        adjclose = info['adjclose'].values
        #replace nan with last number for price
        if np.isnan(adjclose[0]): adjclose[0] = 0
        lastnum = 0
        for i in range(0, len(adjclose)):
            if np.isnan(adjclose[i]):
                adjclose[i] = lastnum
            else:
                lastnum = adjclose[i]

        open = info['open'].values
        #replace nan with adjclose for open
        for i in range(0, len(open)):
            if np.isnan(open[i]):
                open[i] = adjclose[i]

        high = info['high'].values
        # replace nan with adjclose for high
        for i in range(0, len(high)):
            if np.isnan(high[i]):
                high[i] = adjclose[i]

        low = info['low'].values
        # replace nan with adjclose for low
        for i in range(0, len(low)):
            if np.isnan(low[i]):
                low[i] = adjclose[i]

        close = info['close'].values
        # replace nan with adjclose for close
        for i in range(0, len(close)):
            if np.isnan(close[i]):
                close[i] = adjclose[i]

        volume = info['volume'].values
        #replace nan with 0 for volume
        volume[np.isnan(volume)] = 0

        #convert datetime to string
        date = info.index
        date = [x.strftime("%m/%d/%Y") for x in date]

        output = json.dumps({'adjclose': adjclose.tolist(),
                             'open': open.tolist(),
                             'high': high.tolist(),
                             'low': low.tolist(),
                             'close': close.tolist(),
                             'volume': volume.tolist(),
                             'date': date})

        return HttpResponse(output)

@csrf_exempt
def live(request):
    ticker = json.loads(request.body)['ticker']

    if not ticker:
        return HttpResponse('ticker not received')
    else:
        price = si.get_live_price(ticker)

    liveprice = json.dumps({'price': price})

    return HttpResponse(liveprice)

@csrf_exempt
def analysts(request):
    ticker = json.loads(request.body)['ticker']

    if not ticker:
        return HttpResponse('ticker not received')
    else:
        info = si.get_analysts_info(ticker)
        #print info to a text buffer
        with io.StringIO() as buf, redirect_stdout(buf):
            print(info)
            output = buf.getvalue()

        return HttpResponse(output)

@csrf_exempt
def balance(request):
    ticker = json.loads(request.body)['ticker']

    if not ticker:
        return HttpResponse('ticker not received')
    else:
        info = si.get_balance_sheet(ticker)
        # print info to a text buffer
        with io.StringIO() as buf, redirect_stdout(buf):
            print(info)
            output = buf.getvalue()

        return HttpResponse(output)

@csrf_exempt
def cash(request):
    ticker = json.loads(request.body)['ticker']

    if not ticker:
        return HttpResponse('ticker not received')
    else:
        info = si.get_cash_flow(ticker)
        # print info to a text buffer
        with io.StringIO() as buf, redirect_stdout(buf):
            print(info)
            output = buf.getvalue()

        return HttpResponse(output)

@csrf_exempt
def holder(request):
    ticker = json.loads(request.body)['ticker']

    if not ticker:
        return HttpResponse('ticker not received')
    else:
        info = si.get_holders(ticker)
        # print info to a text buffer
        with io.StringIO() as buf, redirect_stdout(buf):
            print(info)
            output = buf.getvalue()

        return HttpResponse(output)

@csrf_exempt
def income(request):
    ticker = json.loads(request.body)['ticker']

    if not ticker:
        return HttpResponse('ticker not received')
    else:
        info = si.get_income_statement(ticker)
        # print info to a text buffer
        with io.StringIO() as buf, redirect_stdout(buf):
            print(info)
            output = buf.getvalue()

        return HttpResponse(output)

@csrf_exempt
def quote(request):
    ticker = json.loads(request.body)['ticker']

    if not ticker:
        return HttpResponse('ticker not received')
    else:
        info = si.get_quote_table(ticker)
        # print info to a text buffer
        with io.StringIO() as buf, redirect_stdout(buf):
            print(info)
            output = buf.getvalue()

        return HttpResponse(output)

@csrf_exempt
def stats(request):
    ticker = json.loads(request.body)['ticker']

    if not ticker:
        return HttpResponse('ticker not received')
    else:
        info = si.get_stats(ticker)
        # print info to a text buffer
        with io.StringIO() as buf, redirect_stdout(buf):
            print(info)
            output = buf.getvalue()

        return HttpResponse(output)

@csrf_exempt
def about_yahoo_fin(request):
    help = '<a href="http://theautomatic.net/yahoo_fin-documentation/">YAHOO_FIN DOCUMENTATION</a><br/>' \
           '<b>stock_info module</b><br/>get_analysts_info<br/>get_balance_sheet<br/>get_cash_flow<br/>get_data<br/>' \
           'get_day_gainers<br/>get_day_losers<br/>get_day_most_active<br/>get_holders<br/>' \
           'get_income_statement<br/>get_live_price<br/>get_quote_table<br/>get_top_crypto<br/>get_stats<br/>' \
           'tickers_dow<br/>tickers_nasdaq<br/>tickers_other<br/>tickers_sp500<br/>'
    return HttpResponse(help)