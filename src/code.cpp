#include <iostream>
#include <string>

using namespace std;

int function1() {
    return 1;
}

int function2() {
    return 2;
}

int function3() {
    return 3;
}


int function7() {
    return 5;
}

int function4() {
    return function7();
}

int function5() {
    return 4;
}

int function6() {
    return function5() + 2;
}

int main() {
    cout << "Hello World!" << endl;
    cout << function1() << endl;
    cout << function2() << endl;
    cout << function3() << endl;
    cout << function4() << endl;
    cout << function5() << endl;
    cout << function6() << endl;
    return 0;
}

