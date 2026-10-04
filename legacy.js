const fs = require('fs');
const args = process.argv.slice(2);

function loadData() {
    const text = fs.readFileSync('legacies.json', 'utf8');
    return JSON.parse(text);
}

function saveData(data) {
    fs.writeFileSync('legacies.json', JSON.stringify(data, null, 2));
}

function pickRandom(array) {
    const index = Math.floor(Math.random() * array.length);
    return array[index];
}

function findGeneration(data, num) {
    const legacy = data.legacies[0];
    return legacy.generations.find(function(g) {
        return g.number === num;
    });
}

function showGeneration(gen) {
    console.log('Generation ' + gen.number + ': ' + gen.heir);
    const box = gen.aspirationDone ? '[x]' : '[ ]';
    console.log(box + ' Aspiration: ' + gen.aspiration);
    console.log('Career: ' + gen.career + ' (level ' + gen.careerLevel + '/' + gen.careerGoal + ')');
}

if (args[0] === 'show') {
    const data = loadData();
    const gen = findGeneration(data, parseInt(args[1], 10));
    if (!gen) {
        console.log('No generation ' + args[1]);
    } else {
        showGeneration(gen);
    }
} else if (args[0] === 'aspire') {
    const data = loadData();
    const gen = findGeneration(data, parseInt(args[1], 10));
    if (!gen) {
        console.log('No generation ' + args[1]);
    } else {
        gen.aspirationDone = true;
        saveData(data);
        console.log(gen.heir + ' completed: ' + gen.aspiration);
    }
} else if (args[0] === 'promote') {
    const data = loadData();
    const gen = findGeneration(data, parseInt(args[1], 10));
    if (!gen) {
        console.log('No generation ' + args[1]);
    } else if (gen.careerLevel >= gen.careerGoal) {
        console.log(gen.heir + ' is already at the top of ' + gen.career + '!');
    } else {
        gen.careerLevel += 1;
        saveData(data);
        console.log(gen.heir + ' promoted to level ' + gen.careerLevel + '/' + gen.careerGoal);
    }
} else if (args[0] === 'roll') {
    const data = loadData();
    console.log(pickRandom(data.miniChallenges));
} else {
    console.log('Commands: show <gen>, aspire <gen>, promote <gen>, roll');
}
