window.onload = async function () {
    const response = await fetch('/get-tickers');
    const tickers = await response.json();
  
    const tickersDiv = document.getElementById('tickers');
    tickers.forEach(ticker => {
      const tickerDiv = document.createElement('div');
      tickerDiv.classList.add('ticker');
      tickerDiv.innerHTML = `
        <div>${ticker.name}</div>
        <div>Last: ${ticker.last}</div>
        <div>Buy: ${ticker.buy}</div>
        <div>Sell: ${ticker.sell}</div>
        <div>Volume: ${ticker.volume}</div>
        <div>Base Unit: ${ticker.base_unit}</div>
      `;
      tickersDiv.appendChild(tickerDiv);
    });
  };
  