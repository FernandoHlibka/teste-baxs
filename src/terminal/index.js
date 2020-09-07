const readline = require('readline');
const { getBestRoute } = require('../api/');

let fileName = '';

const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});

const enterTheRoute = async () => {
    rl.question('Please enter the route > ', async (route) => {
        const routes = route.split('-');

        if(routes) {
            const { best_route, price } = await getBestRoute({ curr: routes[0], dest: routes[1], fileName })
            console.log(`best route: ${best_route} > ${price}`);
            await enterTheRoute();
        }
    });
}

const initTerminal = () => {
    rl.question('Please, tap the name of CSV route file > ', async (answer) => {
    
        if(answer) {
            fileName = answer;
    
            await enterTheRoute();
        }
        
    });
}

module.exports = initTerminal;
  
