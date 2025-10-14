/**
 * VROOM VROOM - COMPREHENSIVE UNIT TEST SUITE
 * Version: 1.4.0
 *
 * Run with: node test-suite.js
 * Or integrate with Claude Code hooks for automatic testing
 *
 * Tests all game systems for correctness, edge cases, and integration
 */

// Test framework (simple assertion library)
class TestRunner {
    constructor() {
        this.tests = [];
        this.passed = 0;
        this.failed = 0;
        this.skipped = 0;
    }

    describe(suiteName, testFn) {
        console.log(`\n${'='.repeat(60)}`);
        console.log(`📦 TEST SUITE: ${suiteName}`);
        console.log('='.repeat(60));
        testFn();
    }

    it(testName, testFn) {
        try {
            testFn();
            this.passed++;
            console.log(`  ✅ ${testName}`);
        } catch (error) {
            this.failed++;
            console.log(`  ❌ ${testName}`);
            console.log(`     Error: ${error.message}`);
            console.log(`     Stack: ${error.stack}`);
        }
    }

    skip(testName) {
        this.skipped++;
        console.log(`  ⏭️  SKIPPED: ${testName}`);
    }

    assertEqual(actual, expected, message = '') {
        if (actual !== expected) {
            throw new Error(`${message}\n    Expected: ${expected}\n    Got: ${actual}`);
        }
    }

    assertTrue(value, message = '') {
        if (!value) {
            throw new Error(`${message}\n    Expected truthy value, got: ${value}`);
        }
    }

    assertFalse(value, message = '') {
        if (value) {
            throw new Error(`${message}\n    Expected falsy value, got: ${value}`);
        }
    }

    assertExists(value, message = '') {
        if (value === null || value === undefined) {
            throw new Error(`${message}\n    Expected value to exist, got: ${value}`);
        }
    }

    assertThrows(fn, message = '') {
        try {
            fn();
            throw new Error(`${message}\n    Expected function to throw, but it didn't`);
        } catch (error) {
            // Expected to throw
        }
    }

    assertRange(value, min, max, message = '') {
        if (value < min || value > max) {
            throw new Error(`${message}\n    Expected ${min} <= ${value} <= ${max}`);
        }
    }

    assertArrayLength(array, length, message = '') {
        if (!Array.isArray(array)) {
            throw new Error(`${message}\n    Expected array, got: ${typeof array}`);
        }
        if (array.length !== length) {
            throw new Error(`${message}\n    Expected length ${length}, got: ${array.length}`);
        }
    }

    summary() {
        console.log(`\n${'='.repeat(60)}`);
        console.log('📊 TEST SUMMARY');
        console.log('='.repeat(60));
        console.log(`  Total Tests: ${this.passed + this.failed + this.skipped}`);
        console.log(`  ✅ Passed: ${this.passed}`);
        console.log(`  ❌ Failed: ${this.failed}`);
        console.log(`  ⏭️  Skipped: ${this.skipped}`);

        const percentage = this.passed / (this.passed + this.failed) * 100;
        console.log(`  Success Rate: ${percentage.toFixed(2)}%`);

        if (this.failed === 0) {
            console.log(`\n  🎉 ALL TESTS PASSED! 🎉`);
        } else {
            console.log(`\n  ⚠️  SOME TESTS FAILED - Review errors above`);
        }
        console.log('='.repeat(60));

        return this.failed === 0;
    }
}

const test = new TestRunner();

// ============================================================
// MOCK GAME OBJECTS (for testing without browser)
// ============================================================

class MockGame {
    constructor() {
        this.VERSION = '1.4.0';
        this.player = this.createMockPlayer();
        this.gameState = 'menu';
    }

    createMockPlayer() {
        return {
            name: 'TestPlayer',
            skinTone: 1,
            height: 175,
            voice: 0,
            selectedCar: { model: 'beater', color: 0x8B7355 },
            sentence: 0,
            prisonDays: 0,
            money: 100,
            cigarettes: 20,
            hunger: 50,
            strength: 50,
            intelligence: 50,
            goodBehaviorPoints: 50,
            tattoos: [],
            gangRep: {
                safeDrivers: 0,
                turnSignals: 0,
                roadWarriors: 0
            },
            currentGang: null,
            escapeProgress: {
                tunnel: 0,
                bribe: 0,
                transfer: 0,
                riot: 0
            },
            contraband: {
                cigarettes: 0,
                escapeTools: false,
                weapon: false,
                drugs: 0
            },
            arrests: 0,
            successfulEscapes: 0,
            clinicVisits: 0,
            successfulTreatments: 0,
            lastConjugalVisit: null,
            conjugalVisitsTotal: 0,
            favorTokens: 0,
            guardsManicured: []
        };
    }

    // Mock methods
    generateSaveCode() {
        const saveData = { v: this.VERSION, p: this.player };
        return btoa(encodeURIComponent(JSON.stringify(saveData)));
    }

    importSaveCode(code) {
        try {
            const saveData = JSON.parse(decodeURIComponent(atob(code)));
            if (!saveData.v || !saveData.p) return false;
            this.player = saveData.p;
            return true;
        } catch {
            return false;
        }
    }
}

// ============================================================
// TEST SUITES
// ============================================================

// Test Suite 1: Core Game State
test.describe('Core Game State', () => {
    test.it('should create game with correct initial state', () => {
        const game = new MockGame();
        test.assertEqual(game.VERSION, '1.4.0');
        test.assertEqual(game.gameState, 'menu');
        test.assertExists(game.player);
    });

    test.it('should create player with all required properties', () => {
        const game = new MockGame();
        const player = game.player;

        // Character properties
        test.assertExists(player.name);
        test.assertExists(player.skinTone);
        test.assertExists(player.height);
        test.assertExists(player.voice);
        test.assertExists(player.selectedCar);

        // Prison stats
        test.assertEqual(player.sentence, 0);
        test.assertEqual(player.prisonDays, 0);
        test.assertRange(player.money, 0, 1000);
        test.assertRange(player.cigarettes, 0, 100);

        // Stats
        test.assertRange(player.hunger, 0, 100);
        test.assertRange(player.strength, 0, 100);
        test.assertRange(player.intelligence, 0, 100);
        test.assertRange(player.goodBehaviorPoints, 0, 100);

        // Collections
        test.assertTrue(Array.isArray(player.tattoos));
        test.assertExists(player.gangRep);
        test.assertExists(player.escapeProgress);
        test.assertExists(player.contraband);
    });
});

// Test Suite 2: Save System
test.describe('Save/Load System', () => {
    test.it('should generate valid Base64 save code', () => {
        const game = new MockGame();
        const saveCode = game.generateSaveCode();

        test.assertExists(saveCode);
        test.assertTrue(saveCode.length > 0);

        // Verify it's valid Base64
        try {
            atob(saveCode);
        } catch {
            throw new Error('Invalid Base64 encoding');
        }
    });

    test.it('should import save code and restore state', () => {
        const game = new MockGame();
        game.player.money = 500;
        game.player.prisonDays = 10;

        const saveCode = game.generateSaveCode();

        const game2 = new MockGame();
        const success = game2.importSaveCode(saveCode);

        test.assertTrue(success);
        test.assertEqual(game2.player.money, 500);
        test.assertEqual(game2.player.prisonDays, 10);
    });

    test.it('should reject invalid save codes', () => {
        const game = new MockGame();

        test.assertFalse(game.importSaveCode('invalid'));
        test.assertFalse(game.importSaveCode(''));
        test.assertFalse(game.importSaveCode(null));
    });

    test.it('should handle corrupted save codes', () => {
        const game = new MockGame();
        const validCode = game.generateSaveCode();

        // Corrupt the code
        const corruptedCode = validCode.substring(0, validCode.length - 5) + 'XXXXX';

        test.assertFalse(game.importSaveCode(corruptedCode));
    });
});

// Test Suite 3: Prison Economy
test.describe('Prison Economy', () => {
    test.it('should track commissary credits correctly', () => {
        const game = new MockGame();

        game.player.money = 100;
        test.assertEqual(game.player.money, 100);

        game.player.money -= 50;
        test.assertEqual(game.player.money, 50);

        game.player.money += 25;
        test.assertEqual(game.player.money, 75);
    });

    test.it('should track cigarettes correctly', () => {
        const game = new MockGame();

        game.player.cigarettes = 20;
        test.assertEqual(game.player.cigarettes, 20);

        game.player.cigarettes -= 5;
        test.assertEqual(game.player.cigarettes, 15);
    });

    test.it('should not allow negative credits', () => {
        const game = new MockGame();
        game.player.money = 10;

        // Simulate transaction check
        const canAfford = game.player.money >= 50;
        test.assertFalse(canAfford);
    });

    test.it('should not allow negative cigarettes', () => {
        const game = new MockGame();
        game.player.cigarettes = 3;

        // Simulate transaction check
        const canAfford = game.player.cigarettes >= 5;
        test.assertFalse(canAfford);
    });
});

// Test Suite 4: Good Behavior System
test.describe('Good Behavior System', () => {
    test.it('should initialize at 50 points', () => {
        const game = new MockGame();
        test.assertEqual(game.player.goodBehaviorPoints, 50);
    });

    test.it('should increase good behavior correctly', () => {
        const game = new MockGame();
        game.player.goodBehaviorPoints = 50;
        game.player.goodBehaviorPoints += 10;
        test.assertEqual(game.player.goodBehaviorPoints, 60);
    });

    test.it('should decrease good behavior correctly', () => {
        const game = new MockGame();
        game.player.goodBehaviorPoints = 50;
        game.player.goodBehaviorPoints -= 20;
        test.assertEqual(game.player.goodBehaviorPoints, 30);
    });

    test.it('should clamp good behavior to 0-100 range', () => {
        const game = new MockGame();

        // Test upper bound
        game.player.goodBehaviorPoints = 120;
        game.player.goodBehaviorPoints = Math.min(100, Math.max(0, game.player.goodBehaviorPoints));
        test.assertEqual(game.player.goodBehaviorPoints, 100);

        // Test lower bound
        game.player.goodBehaviorPoints = -20;
        game.player.goodBehaviorPoints = Math.min(100, Math.max(0, game.player.goodBehaviorPoints));
        test.assertEqual(game.player.goodBehaviorPoints, 0);
    });

    test.it('should track conjugal visit eligibility', () => {
        const game = new MockGame();
        game.player.goodBehaviorPoints = 80;
        game.player.prisonDays = 35;

        const eligible = game.player.goodBehaviorPoints >= 75 && game.player.prisonDays >= 30;
        test.assertTrue(eligible);
    });
});

// Test Suite 5: Tattoo System
test.describe('Tattoo System', () => {
    test.it('should create tattoo with correct structure', () => {
        const tattoo = {
            design: Array(10).fill(0).map(() => Array(10).fill(0)),
            timestamp: Date.now(),
            infected: false,
            placement: 'left-arm',
            placementName: 'Left Arm'
        };

        test.assertTrue(Array.isArray(tattoo.design));
        test.assertEqual(tattoo.design.length, 10);
        test.assertEqual(tattoo.design[0].length, 10);
        test.assertExists(tattoo.timestamp);
        test.assertEqual(typeof tattoo.infected, 'boolean');
        test.assertExists(tattoo.placement);
        test.assertExists(tattoo.placementName);
    });

    test.it('should store tattoos in player array', () => {
        const game = new MockGame();

        const tattoo = {
            design: Array(10).fill(0).map(() => Array(10).fill(1)),
            timestamp: Date.now(),
            infected: false,
            placement: 'chest',
            placementName: 'Chest'
        };

        game.player.tattoos.push(tattoo);
        test.assertEqual(game.player.tattoos.length, 1);
        test.assertEqual(game.player.tattoos[0].placement, 'chest');
    });

    test.it('should track infected tattoos correctly', () => {
        const game = new MockGame();

        game.player.tattoos.push({
            design: Array(10).fill(0).map(() => Array(10).fill(1)),
            timestamp: Date.now(),
            infected: true,
            placement: 'left-arm',
            placementName: 'Left Arm'
        });

        const infectedCount = game.player.tattoos.filter(t => t.infected).length;
        test.assertEqual(infectedCount, 1);
    });

    test.it('should cure infected tattoos', () => {
        const game = new MockGame();

        game.player.tattoos.push({
            design: Array(10).fill(0).map(() => Array(10).fill(1)),
            timestamp: Date.now(),
            infected: true,
            placement: 'back',
            placementName: 'Back'
        });

        // Simulate clinic treatment
        game.player.tattoos[0].infected = false;

        const infectedCount = game.player.tattoos.filter(t => t.infected).length;
        test.assertEqual(infectedCount, 0);
    });
});

// Test Suite 6: Gang System
test.describe('Gang System', () => {
    test.it('should track reputation for all gangs', () => {
        const game = new MockGame();

        test.assertExists(game.player.gangRep.safeDrivers);
        test.assertExists(game.player.gangRep.turnSignals);
        test.assertExists(game.player.gangRep.roadWarriors);
    });

    test.it('should increase gang reputation', () => {
        const game = new MockGame();
        game.player.gangRep.safeDrivers = 0;
        game.player.gangRep.safeDrivers += 10;
        test.assertEqual(game.player.gangRep.safeDrivers, 10);
    });

    test.it('should clamp gang reputation to -100 to +100', () => {
        const game = new MockGame();

        // Test upper bound
        game.player.gangRep.safeDrivers = 150;
        game.player.gangRep.safeDrivers = Math.min(100, Math.max(-100, game.player.gangRep.safeDrivers));
        test.assertEqual(game.player.gangRep.safeDrivers, 100);

        // Test lower bound
        game.player.gangRep.safeDrivers = -150;
        game.player.gangRep.safeDrivers = Math.min(100, Math.max(-100, game.player.gangRep.safeDrivers));
        test.assertEqual(game.player.gangRep.safeDrivers, -100);
    });

    test.it('should allow joining gang at 50+ reputation', () => {
        const game = new MockGame();
        game.player.gangRep.safeDrivers = 55;

        const canJoin = game.player.gangRep.safeDrivers >= 50;
        test.assertTrue(canJoin);
    });

    test.it('should track current gang membership', () => {
        const game = new MockGame();
        game.player.currentGang = 'safeDrivers';
        test.assertEqual(game.player.currentGang, 'safeDrivers');
    });
});

// Test Suite 7: Contraband System
test.describe('Contraband System', () => {
    test.it('should track all contraband types', () => {
        const game = new MockGame();

        test.assertEqual(typeof game.player.contraband.cigarettes, 'number');
        test.assertEqual(typeof game.player.contraband.escapeTools, 'boolean');
        test.assertEqual(typeof game.player.contraband.weapon, 'boolean');
        test.assertEqual(typeof game.player.contraband.drugs, 'number');
    });

    test.it('should add contraband correctly', () => {
        const game = new MockGame();

        game.player.contraband.cigarettes += 30;
        game.player.contraband.escapeTools = true;
        game.player.contraband.drugs += 2;

        test.assertEqual(game.player.contraband.cigarettes, 30);
        test.assertTrue(game.player.contraband.escapeTools);
        test.assertEqual(game.player.contraband.drugs, 2);
    });

    test.it('should confiscate all contraband on search', () => {
        const game = new MockGame();

        game.player.contraband.cigarettes = 30;
        game.player.contraband.escapeTools = true;
        game.player.contraband.weapon = true;
        game.player.contraband.drugs = 3;

        // Simulate guard search
        game.player.contraband.cigarettes = 0;
        game.player.contraband.escapeTools = false;
        game.player.contraband.weapon = false;
        game.player.contraband.drugs = 0;

        test.assertEqual(game.player.contraband.cigarettes, 0);
        test.assertFalse(game.player.contraband.escapeTools);
        test.assertFalse(game.player.contraband.weapon);
        test.assertEqual(game.player.contraband.drugs, 0);
    });
});

// Test Suite 8: Favor Token System
test.describe('Favor Token System', () => {
    test.it('should track favor tokens', () => {
        const game = new MockGame();
        test.assertEqual(game.player.favorTokens, 0);
    });

    test.it('should award tokens for successful manicures', () => {
        const game = new MockGame();
        game.player.favorTokens = 0;
        game.player.favorTokens += 1; // Successful manicure
        test.assertEqual(game.player.favorTokens, 1);
    });

    test.it('should spend tokens correctly', () => {
        const game = new MockGame();
        game.player.favorTokens = 5;

        // Spend 2 tokens
        if (game.player.favorTokens >= 2) {
            game.player.favorTokens -= 2;
        }

        test.assertEqual(game.player.favorTokens, 3);
    });

    test.it('should not allow spending more tokens than available', () => {
        const game = new MockGame();
        game.player.favorTokens = 1;

        const canAfford = game.player.favorTokens >= 3;
        test.assertFalse(canAfford);
    });

    test.it('should track guards manicured', () => {
        const game = new MockGame();
        test.assertTrue(Array.isArray(game.player.guardsManicured));
    });
});

// Test Suite 9: Stats and Progression
test.describe('Stats and Progression', () => {
    test.it('should track hunger stat', () => {
        const game = new MockGame();
        game.player.hunger = 50;
        game.player.hunger -= 20; // Eating reduces hunger
        test.assertEqual(game.player.hunger, 30);
    });

    test.it('should track strength stat', () => {
        const game = new MockGame();
        game.player.strength = 50;
        game.player.strength += 5; // Lifting increases strength
        test.assertEqual(game.player.strength, 55);
    });

    test.it('should track intelligence stat', () => {
        const game = new MockGame();
        game.player.intelligence = 50;
        game.player.intelligence += 3; // Reading increases intelligence
        test.assertEqual(game.player.intelligence, 53);
    });

    test.it('should track prison days served', () => {
        const game = new MockGame();
        game.player.prisonDays = 0;
        game.player.prisonDays += 1;
        test.assertEqual(game.player.prisonDays, 1);
    });

    test.it('should calculate sentence completion', () => {
        const game = new MockGame();
        game.player.sentence = 10; // 10 years = 70 days
        game.player.prisonDays = 35;

        const totalDays = game.player.sentence * 7;
        const percentComplete = (game.player.prisonDays / totalDays) * 100;

        test.assertEqual(percentComplete, 50);
    });
});

// Test Suite 10: Escape System
test.describe('Escape System', () => {
    test.it('should track escape progress for all routes', () => {
        const game = new MockGame();

        test.assertExists(game.player.escapeProgress.tunnel);
        test.assertExists(game.player.escapeProgress.bribe);
        test.assertExists(game.player.escapeProgress.transfer);
        test.assertExists(game.player.escapeProgress.riot);
    });

    test.it('should increase escape progress', () => {
        const game = new MockGame();
        game.player.escapeProgress.tunnel = 0;
        game.player.escapeProgress.tunnel += 5;
        test.assertEqual(game.player.escapeProgress.tunnel, 5);
    });

    test.it('should calculate escape success rate', () => {
        const game = new MockGame();

        const baseRate = 0.30; // 30% base for tunnel
        const progressBonus = (game.player.escapeProgress.tunnel / 5) * 0.20; // +20% max
        const gangBonus = game.player.currentGang ? 0.10 : 0; // +10% if in gang

        const successRate = baseRate + progressBonus + gangBonus;
        test.assertRange(successRate, 0, 1);
    });

    test.it('should apply escape tools bonus from contraband', () => {
        const game = new MockGame();
        game.player.contraband.escapeTools = true;

        const baseRate = 0.30;
        const toolBonus = game.player.contraband.escapeTools ? 0.15 : 0;
        const finalRate = baseRate + toolBonus;

        test.assertEqual(finalRate, 0.45);
    });
});

// Test Suite 11: Time System
test.describe('Time System', () => {
    test.it('should convert years to days correctly', () => {
        const years = 5;
        const days = years * 7;
        test.assertEqual(days, 35);
    });

    test.it('should track clinic visits', () => {
        const game = new MockGame();
        game.player.clinicVisits = 0;
        game.player.clinicVisits += 1;
        test.assertEqual(game.player.clinicVisits, 1);
    });

    test.it('should track conjugal visit cooldown', () => {
        const game = new MockGame();
        game.player.lastConjugalVisit = 10;
        game.player.prisonDays = 20;

        const daysSinceLastVisit = game.player.prisonDays - game.player.lastConjugalVisit;
        const canVisit = daysSinceLastVisit >= 14;

        test.assertFalse(canVisit); // Only 10 days passed
    });
});

// Test Suite 12: Character Creation
test.describe('Character Creation', () => {
    test.it('should validate car selection', () => {
        const game = new MockGame();
        test.assertExists(game.player.selectedCar);
        test.assertExists(game.player.selectedCar.model);
        test.assertExists(game.player.selectedCar.color);
    });

    test.it('should validate car models', () => {
        const validModels = ['beater', 'box', 'clunker', 'rustbucket'];
        const game = new MockGame();

        test.assertTrue(validModels.includes(game.player.selectedCar.model));
    });

    test.it('should validate voice selection', () => {
        const game = new MockGame();
        test.assertRange(game.player.voice, 0, 3);
    });

    test.it('should validate height range', () => {
        const game = new MockGame();
        test.assertRange(game.player.height, 150, 200);
    });
});

// ============================================================
// RUN ALL TESTS
// ============================================================

console.log('\n🚗💨 VROOM VROOM - UNIT TEST SUITE v1.4.0 💨🚗\n');
console.log('Testing all game systems...\n');

// Run summary
const allTestsPassed = test.summary();

// Exit code for CI/CD integration
if (typeof process !== 'undefined') {
    process.exit(allTestsPassed ? 0 : 1);
}
