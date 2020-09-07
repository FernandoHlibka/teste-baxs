const fs = require('fs');

const basePath = __dirname.slice(0, (__dirname.length - 3));

let filePath = basePath + 'storage/';

const utils = require('../utils');

const returnPossibility = async ({ routes, curr, dest }) => {
    return routes.filter(route => route.includes(curr) && route.includes(dest));
}

const generatePossibilities = async ({ nodes }) => {
    const maxLen = nodes.length,
        possibilities=[];
    
    let i = 1;
    
    while(i <= maxLen) {
        const permutations = await utils.getPermutations(nodes, i);
        permutations.forEach(subset => {
            if(subset.length) {
                possibilities.push(subset);
            }
        })
        i++;
    }

    return possibilities;
}

const fileLoop = async (data) => {
    const mountedRoutes = [];
    
    const routes = data.split(' ');
    
    const rt = routes[0].split('\n').join(',');

    const nodes = [];
    let tmp = [];

    rt.split(',').forEach((str, i) => {
        const index = i % 3;
        if(!nodes.includes(str) && (index === 0 || index === 1)) {
            nodes.push(str);    
        }

        tmp.push(str);

        if(index === 2) {
            mountedRoutes.push(tmp);
            tmp = [];
        }
    })

    return { routes: mountedRoutes, nodes };
}

const getRoutes = async ({ fileName }) => {
    const response = await fs.promises.readFile(`${filePath + (fileName ? fileName : 'input-routes.csv')}`, 'utf8').then( async data => {
        const { routes: fileRoutes, nodes } = await fileLoop(data);
        return { fileRoutes, nodes };
    }).catch(err => {} )

    return { response };
}

const getBestRoute = async ({ curr, dest, fileName }) => {
    curr = curr.toUpperCase();
    dest = dest.toUpperCase();
    const { response } = await getRoutes({ fileName });
    
    let bestPossibility = [],
            bestPossibilityString = "Route not found",
            bestPrice = 0;

    const hasCurrAndDestInNodes = response.nodes.indexOf(curr) || response.nodes.indexOf(dest);

    if(hasCurrAndDestInNodes) {
        const nodes = response.nodes.filter(node => node !== curr && node !== dest);

        const middlePossibilities = await generatePossibilities({ nodes }),
            hasPossibility = await returnPossibility({ curr, dest, routes: response.fileRoutes });

        if(hasPossibility.length) {
            bestPossibility.push(hasPossibility[0]);
            bestPrice = bestPossibility[0][2];
            bestPossibilityString = `${curr}-${dest}`;
        }

        for(let m of middlePossibilities) {
            let tempRoute = [];
                let i = 0;
                m.splice(0, 0, curr);
                m.push(dest);

            while(i < m.length - 1) {
                const p = await returnPossibility({ curr: m[i], dest: m[i+1], routes: response.fileRoutes })
                if(p.length > 0) {
                    tempRoute.push(p[0])
                } else {
                    tempRoute = []
                    break
                }

                i++
            }
            
            if(tempRoute.length > 0) {
                let tempPrice = 0

                tempRoute.forEach(r => {
                    tempPrice += parseFloat(r[2])
                })

                let bestCurrentPrice = 0

                bestPossibility.forEach(b => {
                    bestCurrentPrice += parseFloat(b[2])
                })
        
                if(tempPrice < bestCurrentPrice || bestCurrentPrice == 0) {
                    bestPossibility = tempRoute
                    bestPrice = tempPrice
                    bestPossibilityString = m.join('-');
                }
            }
        }
    }

    return {
        from: curr,
        to: dest,
        price: bestPrice,
        best_route: bestPossibilityString
    }
}

const addNewRoute = async ({ name_route_a, name_route_b, price, fileName }) => {
    const newRoute = `${name_route_a},${name_route_b},${price}`;

    const routes = await fs.promises.readFile(`${filePath + (fileName ? fileName : 'input-routes.csv')}`, 'utf8').then( async data => {
        return data;
    }).catch(err => {} )
    
    await fs.writeFileSync(filePath, routes + '\n' + newRoute, 'utf8');
    
    return { msg: 'OK' };
}

module.exports = {
    getBestRoute,
    addNewRoute
}