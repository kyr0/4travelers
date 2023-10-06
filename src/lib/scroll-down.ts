export async function scrollDown(page: any, duration = 500) {
    return new Promise((resolve: Function) => {
        page.evaluate(() => {
            return new Promise((resolve: Function) => {
                var totalHeight = 0
                var distance = 100
                var scrolls = 0 // scrolls counter
                var timer = setInterval(() => {
                  const element = document.documentElement
        
                  element.scrollBy(0, distance)
                  totalHeight += distance
                  scrolls++ // increment counter
        
                  // stop scrolling if reached the end or the maximum number of scrolls
                  if (totalHeight >= element.scrollHeight || scrolls >= 150) {
                    clearInterval(timer)
                    resolve()
                  }
                }, 50)
            })
        }, duration).then(() => { resolve() });
    })   
}