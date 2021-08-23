#include <iostream>
#include <vector>
#include <time.h>
#include <stdio.h>

using std::cin;			using std::cout;
using std::endl;		using std::vector;

class sudoku {
friend std::ostream &PrintAnswer(std::ostream &, const sudoku &);
friend std::ostream &PrintPuzzle(std::ostream &, const sudoku &);
private:
	int answer[9][9];
	int puzzle[9][9];
	int solve[9][9];
public:
	int CreateTable(int x, int y);
	void CopyPuzzleAnswer();
	void CopySolvePuzzle();
	void CopyPuzzleSolve();
	bool IsValid(int, int, int);
	bool SolveSudoku(int, int);
	bool Unique();
	void Hide();
    void Save();
};

void sudoku::Save () {
    FILE *f = fopen ("puzzle.txt", "w");
    fprintf (f, "[");
	for(size_t ix = 0; ix != 9; ++ix){
		for (size_t iy = 0; iy != 9; ++iy){
            fprintf (f, "%d,", puzzle[ix][iy]);
        }
    }
    fprintf (f, "0]");
}

std::ostream &PrintAnswer(std::ostream &os, const sudoku &table)
{
	for(size_t ix = 0; ix != 9; ++ix){
		for (size_t iy = 0; iy != 9; ++iy){
			if (table.answer[ix][iy] == 0){
				os << "  ";
			}
			else{
				os << table.answer[ix][iy] << " ";
			}
			if (iy == 2 || iy == 5){
				cout << "| ";
			}
			if ((ix == 2 && iy == 8) || (ix == 5 && iy == 8)){
				cout << "\n- - - - - - - - - - -";
			}
		}
		os << endl;
	}
	return os;
}

std::ostream &PrintPuzzle(std::ostream &os, const sudoku &table)
{
	for (size_t ix = 0; ix != 9; ++ix){
		for (size_t iy = 0; iy != 9; ++iy){
			if (table.puzzle[ix][iy] == 0){
				os << "  ";
			}
			else{
				os << table.puzzle[ix][iy] << " ";
			}
			if (iy == 2 || iy == 5){
				cout << "| ";
			}
			if ((ix == 2 && iy == 8) || (ix == 5 && iy == 8)){
				cout << "\n- - - - - - - - - - -";
			}
		}
		os << endl;
	}
	return os;
}

int sudoku::CreateTable(int x, int y)
{
	std::vector<int> tab(9, 1);

	for(size_t i = 0; i != x; ++i){
		tab[answer[i][y]-1] = 0;
	}

	for (size_t i = 0; i != y; ++i){
		tab[answer[x][i]-1] = 0;
	}

	for(size_t i = (3*(x/3)); i < (3*(x/3)+3); ++i){
		for(size_t j = (3*(y/3)); j < y; ++j){
			tab[answer[i][j]-1] = 0;
		}
	}

	int size = 0;
	for (size_t i = 0; i < 9; ++i){
		size += tab[i];
	}

	int *tab_ptr = new int[sizeof(int)*size];

	for (size_t i = 0, j = 0; i != 9; ++i){
		if (tab[i] == 1){
			tab_ptr[j] = i + 1;
			j += 1;
		}
	}

	int pos_x, pos_y;
	if (x == 8){
		pos_x = 0;
		pos_y = y + 1;
	}
	else{
		pos_x = x + 1;
		pos_y = y;
	}

	while (size > 0){
		int randomize = rand() % size;		//randomly generates a number between 0 and 8
		answer[x][y] = tab_ptr[randomize];
		tab_ptr[randomize] = tab_ptr[size-1];

		size -= 1;

		if (x == 8 && y == 8){
			delete tab_ptr;
			return 1;
		}
		if (CreateTable(pos_x, pos_y) == 1){	//recursion
			delete tab_ptr;
			return 1;
		}
	}
	delete tab_ptr;
	return 0;
}

void sudoku::CopyPuzzleAnswer()
{
	for (size_t i = 0; i < 9; ++i){
		for (size_t j = 0; j < 9; ++j){
			puzzle[i][j] = answer[i][j];
		}
	}
}

void sudoku::CopySolvePuzzle()
{
	for (size_t i = 0; i < 9; ++i){
		for (size_t j = 0; j < 9; ++j){
			solve[i][j] = puzzle[i][j];
		}
	}
}

void sudoku::CopyPuzzleSolve()
{
	for (size_t i = 0; i < 9; ++i){
		for (size_t j = 0; j < 9; ++j){
			puzzle[i][j] = solve[i][j];
		}
	}	
}

void sudoku::Hide()
{
	int i = rand() % 9;
	int j = rand() % 9;
	int origin = puzzle[i][j];
	int modified;
	if (puzzle[i][j] != 0){
		puzzle[i][j] = 0;
	}

	CopySolvePuzzle();								//copy puzzle into solve

	SolveSudoku(0, 0);					//solve sudoku on solve

	if (!Unique()){
		Hide();
	}
	
}

bool sudoku::Unique()
{
	for (size_t i = 0; i != 9; ++i){
		for (size_t j = 0; j != 9; ++j){
			if (solve[i][j] != answer[i][j]){
				return false;
			}
		}
	}
	return true;
}

bool sudoku::IsValid(int row, int col, int n)
{
	int row_start = (row / 3) * 3;
	int col_start = (col / 3) * 3;

	for (size_t i = 0; i != 9; i++){
		if (solve[row][i] == n || solve[i][col] == n || solve[row_start + (i % 3)][col_start + (i / 3)] == n){
			return false;
		}
	}
	return true;
}

bool sudoku::SolveSudoku(int row, int col)
{
	if (row < 9 && col < 9){
		if (solve[row][col] != 0){
			if ((col + 1) < 9){
				return SolveSudoku(row, col + 1);
			}
			else if ((row + 1) < 9){
				return SolveSudoku(row + 1, 0);
			}
			else{
				return true;
			}
		}
		else{
			for (int i = 0; i < 9; ++i){
				if (IsValid(row, col, i + 1)){
					solve[row][col] = i + 1;
					if ((col + 1) < 9){
						if (SolveSudoku(row, col + 1)){
							return true;
						}
						else{
							solve[row][col] = 0;
						}
					}
					else if ((row + 1) < 9){
						if (SolveSudoku(row + 1, 0)){
							return true;
						}
						else{
							solve[row][col] = 0;
						}
					}
					else{
						return true;
					}
				}
			}
		}
		return false;
	}
	else{
		return true;
	}
}

int main(int argc, char *argv[])
{
	srand(time(NULL));
	sudoku Sudoku;
	Sudoku.CreateTable(0, 0);

	Sudoku.CopyPuzzleAnswer();
	// unsigned difficulty;
	// cout << "Enter the difficulty level(1 to 4): ";
	// cin >> difficulty;
	// if (cin.fail() || difficulty > 4 || difficulty <= 0){
	// 	cout << "Error: Illegal Input" << endl;
	// 	return -1;
	// }
    int perc = 100 - atoi(argv[1]);
    int n = perc/100.*81;
	for (int i = 0; i < n; i++){
		Sudoku.Hide();
	}

    Sudoku.Save();
	//PrintPuzzle(cout, Sudoku);
	cout << endl;
	// PrintAnswer(cout, Sudoku);
}