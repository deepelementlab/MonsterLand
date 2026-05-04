with open('game.config.js','r',encoding='utf-8') as f: c=f.read()
idx=c.rfind('// --- ')
new_ending = '''// --- central platform ---
            { type: 'block', material: 'wood', x: 960, y: 510, width: 140, height: 20 },
            { type: 'block', material: 'wood', x: 1100, y: 620, width: 100, height: 40 },
            { type: 'block', material: 'wood', x: 1075, y: 565, width: 20, height: 70 },
            { type: 'block', material: 'wood', x: 1125, y: 565, width: 20, height: 70 },
            { type: 'block', material: 'wood', x: 1100, y: 520, width: 90, height: 20 },
            { type: 'pig', x: 1100, y: 575, radius: 20 },
            { type: 'pig', x: 960, y: 475, radius: 20 },
            { type: 'block', material: 'glass', x: 960, y: 445, width: 80, height: 20 },
            { type: 'block', material: 'stone', x: 930, y: 420, width: 25, height: 30 },
            { type: 'block', material: 'stone', x: 990, y: 420, width: 25, height: 30 },
            { type: 'block', material: 'wood', x: 960, y: 400, width: 60, height: 15 }
        ]
    }
];
'''
fixed = c[:idx] + new_ending
with open('game.config.js','w',encoding='utf-8') as f: f.write(fixed)
print('Done')
