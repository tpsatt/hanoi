/*
* tower: a list of three arrays of ints, each int representing the size of the circle on that peg
* moves: an array of two ints in which the first int is the peg the piece is moved from, and the
* second is the peg it is moved to.
*/

/*
* arrayEquals: [listof a], [listof a] -> boolean
* inputs: two arrays of arrays, strings, numbers or booleans
* outputs: true if the arrays have the same length and if all of their elements are equal to each
* other, false if not
*/

function arrayEquals(l1,l2) {
    if (!(l1.length == l2.length)) {
        return false;
    }
    for (var i=0;i<l1.length;i++) {
        if (Array.isArray(l1[i])) {
            if (!arrayEquals(l1[i],l2[i])) {
                return false;
            }
        } else {
            if (l1[i] != l2[i]) {
                return false;
            }
        }
    }
    return true;
}

QUnit.test( "arrayEquals test", function ( assert ) {
    assert.equal(arrayEquals([1,2,4],[1,4,2]), false);
    assert.equal(arrayEquals([1,2,4],[1,2,4]), true);
    assert.equal(arrayEquals([[1,2],[3,4]],[[1,2],[3,4]]), true);
    assert.equal(arrayEquals([[1,2],[4,4]],[[1,2],[3,4]]), false);
    assert.equal(arrayEquals([],[]), true);
                                            
});

/* towerMove: tower, move -> tower
* inputs: tower, the position of the tower before the move, move an integer pair which contains the
* position of the piece to be moved and the position of where it should be moved to. Move must be
* a valid move.
* outputs: tower, the result of the move
*/

function towerMove(tower,move) {
    tower[move[1]].unshift(tower[move[0]].shift());
    return tower;
}

QUnit.test( "towerMove test", function( assert ) {
  assert.deepEqual(towerMove([[1,2,3],[],[]], [0,1]), [[2,3],[1],[]]);
  assert.deepEqual(towerMove([[1,2,3],[4,5],[]], [0,1]), [[2,3],[1,4,5],[]]);
});

/*
* hanoiOracle: tower, [listof moves] -> boolean
* inputs: tower, the starting position of the tower of hanoi, and alom, a list of moves which
* represents the moves required to solve the tower problem
* outputs: true if the moves follow the rules of hanoi and solve the problem, false if not
*/

function hanoiOracle(tower,alom) {
    for (var i=0;i<alom.length;i++) {
        // check if moves are in bounds of a tower (0-2)
        if (!(alom[i][0] >= 0 && alom[i][0] <= 2 && alom[i][1] >= 0 && alom[i][1] <=2)) {
            return false;
        }
        // check that the tower is in ascending order after a move
        towerMove(tower,alom[i]).reduce(
                function (ascendingArray, accumulator) {
                    var i, isAscending;
                    isAscending = true;
                    for (i=1;i<ascendingArray.length;i++) {
                        isAscending = isAscending && ascendingArray[i-1] < ascendingArray[i];
                    };
                    return isAscending && accumulator;
                },true);
    }
    if (tower[0].length != 0 || tower[1].length != 0) {
        return false;
    }
        var i, isAscending;
        isAscending = true;
        for (i=1;i<tower[2].length;i++) {
            isAscending = isAscending && tower[2][i-1] < tower[2][i];
        };
        if (!isAscending) {
            return false;
        }
    return true;
}

QUnit.test( "hanoiOracle test", function( assert ) {
  assert.equal(hanoiOracle([[1,2],[],[]],[[0,1],[0,2],[1,2]]), true);
  assert.equal(hanoiOracle([[1,2,3],[],[]],[[0,2],[0,1],[2,1],[0,2],[1,0],[1,2],[0,2]]), true);
  assert.equal(hanoiOracle([[1,2,3],[],[]],[[0,1],[0,2],[1,2],[0,1],[2,0],[2,1],[0,1]]),false);
  assert.equal(hanoiOracle([[1,2,3],[],[]],[[0,1],[0,1]]),false)
});

/*
* hanoi: tower, n, p, q -> [listof moves]
* inputs: tower: a tower representing the starting position of the tower of hanoi, n: the number of
* disks to be moved, p: the peg to move the discs from, and q: the peg the to move the disks to
* outputs: a list of moves which gives the user all of the moves required to solve the tower
* problem
*/

function hanoi(tower,n,p,q) {
    if (n == 1) {
        return [[p, q]];
    }
    var notPorQ = [0,1,2].filter(function (x) { return x != p && x != q })[0];
    return hanoi(tower,n-1,p,notPorQ).concat(hanoi(tower,1,p,q)).concat(hanoi(tower,n-1,notPorQ,q));
}

QUnit.test( "hanoi test", function ( assert ) {
    assert.equal(hanoiOracle([[1,2,3],[],[]],hanoi([[1,2,3],[],[]],3,0,2)),true);
});
