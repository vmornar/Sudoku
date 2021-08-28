let N = 9

function SolveSudoku(grid) {

    let cell = { row: 0, col: 0 };

    // If there is no unassigned location, we are done
    if (!FindUnassignedLocation(grid, cell))
        return true; // success!

    // consider digits 1 to 9
    for (let num = 1; num <= 9; num++) {
        // if looks promising
        if (isSafe(grid, cell.row, cell.col, num)) {
            // make tentative assignment
            grid[cell.row][cell.col] = num;

            // return, if success, yay!
            if (SolveSudoku(grid))
                return true;

            // failure, unmake & try again
            grid[cell.row][cell.col] = 0;
        }
    }
    return false; // this triggers backtracking
}

/* Searches the grid to find an entry that is still unassigned. If
   found, the reference parameters row, col will be set the location
   that is unassigned, and true is returned. If no unassigned entries
   remain, false is returned. */
function FindUnassignedLocation(grid, cell) {
    for (cell.row = 0; cell.row < N; (cell.row)++)
        for (cell.col = 0; cell.col < N; (cell.col)++)
            if (grid[cell.row][cell.col] == 0)
                return true;
    return false;
}

/* Returns a boolean which indicates whether an assigned entry
   in the specified row matches the given number. */
function UsedInRow(grid, row, num) {
    for (let col = 0; col < N; col++)
        if (grid[row][col] == num)
            return true;
    return false;
}

/* Returns a boolean which indicates whether an assigned entry
   in the specified column matches the given number. */
function UsedInCol(grid, col, num) {
    for (let row = 0; row < N; row++)
        if (grid[row][col] == num)
            return true;
    return false;
}

/* Returns a boolean which indicates whether an assigned entry
   within the specified 3x3 box matches the given number. */
function UsedInBox(grid, boxStartRow, boxStartCol, num) {
    for (let row = 0; row < 3; row++)
        for (let col = 0; col < 3; col++)
            if (grid[row + boxStartRow][col + boxStartCol] == num)
                return true;
    return false;
}

/* Returns a boolean which indicates whether it will be legal to assign
   num to the given row,col location. */
function isSafe(grid, row, col, num) {
    /* Check if 'num' is not already placed in current row,
       current column and current 3x3 box */
    return !UsedInRow(grid, row, num) &&
        !UsedInCol(grid, col, num) &&
        !UsedInBox(grid, row - row % 3, col - col % 3, num);
}

function genSudoku(perc) {

    let grid = new Array(N);
    let numbers = [];
    let i, j, k, tmp;
    for (i = 0; i < N; i++) {
        grid[i] = new Array(N);
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
    } while (!SolveSudoku(grid));

    let puzzle = [];
    k = 0;
    perc = parseInt(perc);
    for (i = 0; i < N; i++) {
        for (j = 0; j < N; j++) {
            if (Math.round(Math.random() * 100) < perc) {
                grid[i][j] = 0;
            }
            puzzle[k++] = grid[i][j];
        }
    }
    puzzle[k] = 0;
    return puzzle;
}

module.exports = { genSudoku };