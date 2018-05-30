const STORAGE = require('../storage');

let mocha = require('mocha');
let expect = require('chai').expect;

describe('Test storage', () => {
    beforeEach(() => {
        STORAGE.removeStorageFile();
        STORAGE.clear();
    });

    describe('General tests', () => {
        it('Should add items successfully', () => {
            STORAGE.put('first', 1);
            STORAGE.put('second', 2);
            STORAGE.put('third', 3);
            let expected = JSON.stringify({ first: 1, second: 2, third: 3 });
            expect(JSON.stringify(STORAGE.getAll())).to.equal(expected);
        });

        it('Get function should return proper value', () => {
            STORAGE.put('first', true);
            STORAGE.put('second', 2);
            STORAGE.put('third', 3);
            expect(STORAGE.get('first')).to.be.true;
        });

        it('Should update key successfully', () => {
            STORAGE.put('first', 1);
            STORAGE.put('second', 2);
            STORAGE.put('third', 3);
            STORAGE.update('second', 'SecondUpdated');
            let expected = STORAGE.get('second');
            expect(expected).to.equal('SecondUpdated');
        });

        it('Should remove key successfully', () => {
            STORAGE.put('first', 1);
            STORAGE.put('second', 2);
            STORAGE.put('third', 3);
            STORAGE.remove('first');
            let expected = JSON.stringify({ second: 2, third: 3 });
            expect(JSON.stringify(STORAGE.getAll())).to.equal(expected);
        });

        it('Should be able to save and load data into storage.json properly', () => {
            STORAGE.put('first', 1);
            STORAGE.put('second', 2);
            STORAGE.put('third', 3);
            STORAGE.save(() => {
                STORAGE.clear();
                STORAGE.load(() => {
                    let expected = JSON.stringify({ first: 1, second: 2, third: 3 });
                    expect(JSON.stringify(STORAGE.getAll())).to.equal(expected);
                });
            });
        });

        it('Should clear the storage in memory properly', () => {
            STORAGE.put('first', 1);
            STORAGE.put('second', 2);
            STORAGE.put('third', 3);
            STORAGE.clear();
            expect(STORAGE.getAll()).to.equal('There are no items in the storage');
        });
    });

    describe('Throw Error tests', () => {
        it('Should Throw Type Error when the supplied key is not a string', () => {
            expect(() => STORAGE.put([1, 2, 3], 1)).to.throw(TypeError);
            expect(() => STORAGE.update(1, 1)).to.throw(TypeError);
            expect(() => STORAGE.get({})).to.throw(TypeError);
            expect(() => STORAGE.delete(true, 1)).to.throw(TypeError);
        });

        it('Should throw Error when trying to add already existing key', () => {
            STORAGE.put('first', 1);
            expect(() => STORAGE.put('first', 1.1)).to.throw(Error);
        });

        it('Should throw Error when trying to get, update, remove non-existing key', () => {
            STORAGE.put('first', 1);
            expect(() => STORAGE.update('second', 1.1)).to.throw(Error);
            expect(() => STORAGE.get('third')).to.throw(Error);
            expect(() => STORAGE.delete('fourth')).to.throw(Error);
        });
    });
});