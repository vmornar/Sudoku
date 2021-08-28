let N = 9
let org;

function CreateSudoku(grid) {
    let cell = { row: 0, col: 0 };
    if (!FindUnassignedLocation(grid, cell))
        return true;
    for (let num = 1; num <= 9; num++) {
        if (isValid(grid, cell.row, cell.col, num)) {
            grid[cell.row][cell.col] = num;
            if (CreateSudoku(grid))
                return true;
            grid[cell.row][cell.col] = 0;
        }
    }
    return false; 
}

function FindUnassignedLocation(grid, cell) {
    for (cell.row = 0; cell.row < N; (cell.row)++)
        for (cell.col = 0; cell.col < N; (cell.col)++)
            if (grid[cell.row][cell.col] == 0)
                return true;
    return false;
}

function isValid(grid, row, col, num) {
    let row_start = Math.floor(row / 3) * 3;
	let col_start = Math.floor(col / 3) * 3;
	for (let i = 0; i != 9; i++){
        if (grid[row][i] == num
            || grid[i][col] == num
            || grid[row_start + (i % 3)][col_start + Math.floor(i / 3)] == num) {
			return false;
		}
	}
	return true;
}

function isUnique(grid, sol) {
 	for (let i = 0; i < 9; ++i){
		for (let j = 0; j < 9; ++j){
			if (grid[i][j] != sol[i][j]){
				return false;
			}
		}
	}
	return true;   
}

function copyGrid(a, b) {
    for (i = 0; i < N; i++) {
        for (j = 0; j < N; j++) {
            b[i][j] = a[i][j];
        }
    }
}

function solveSudoku(sol, row, col) {
	if (row < 9 && col < 9) {
		if (sol[row][col] != 0){
			if ((col + 1) < 9){
				return solveSudoku(sol, row, col + 1);
			} else if ((row + 1) < 9){
				return solveSudoku(sol, row + 1, 0);
			} else{
				return true;
			}
		} else {
			for (let i = 0; i < 9; ++i) {
				if (isValid(sol, row, col, i + 1)) {
					sol[row][col] = i + 1;
					if ((col + 1) < 9) {
						if (solveSudoku(sol, row, col + 1)) {
							return true;
						} else {
							sol[row][col] = 0;
						}
					} else if ((row + 1) < 9) {
						if (solveSudoku(sol, row + 1, 0)) {
							return true;
						} else {
							sol[row][col] = 0;
						}
					} else {
						return true;
					}
				}
			}
		}
		return false;
	} else {
		return true;
	}
}

function genSudoku(perc) {
    let grid = new Array(N);
    let sol = new Array(N);
    org = new Array(N);
    let numbers = [];
    let i, j, k, tmp;
    for (i = 0; i < N; i++) {
        grid[i] = new Array(N);
        sol[i] = new Array(N);
        org[i] = new Array(N);
    }
    do {
        for (i = 0; i < N; i++) numbers[i] = i + 1;
        for (i = 0; i < 100; i++) {
            j = Math.round(Math.random() * (N - 1));
            k = Math.round(Math.random() * (N - 1));
            tmp = numbers[j];
            numbers[j] = numbers[k];
            numbers[k] = tmp;
        }
        for (i = 0; i < N; i++) {
            for (j = 0; j < N; j++) {
                if (i == 0) {
                    grid[i][j] = numbers[j];
                } else {
                    grid[i][j] = 0;
                }
            }
        }
    } while (!CreateSudoku(grid));
    copyGrid(grid, org);
    let puzzle = [];
    for (k = 0; k < parseInt(perc); k++) {
        while (1) {
            do {
                i = Math.round(Math.random() * (N - 1));
                j = Math.round(Math.random() * (N - 1));
            } while (grid[i][j] == 0);
            let orig = grid[i][j];
            grid[i][j] = 0;
            copyGrid(grid, sol);
            solveSudoku(sol, 0, 0);
            if (!isUnique(grid, sol)) break;
            grid[i][j] = orig;
        }
    }
    k = 0;
    for (i = 0; i < N; i++) {
        for (j = 0; j < N; j++) {
            puzzle[k++] = grid[i][j];
        }
    }
    puzzle[k] = 0;
    return puzzle;
}

module.exports = { genSudoku, org };