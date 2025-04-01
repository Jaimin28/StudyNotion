#include <iostream>
#include<bits/stdc++.h>
#define ll long long
#define MOD 1000000007
using namespace std;
void solve()
{
    // string s;
    // cin >> s;
    // vector<char> p;
    // for(char c:s){
    //     if(c!= '+'){
    //         p.push_back(c);
    //     }
    // }
    // sort(p.begin(),p.end());
    // string result;
    // for(size_t i=0;i<p.size();i++){
    //     if(i>0){
    //         result+='+';
    //     }
    //     result +=p[i];
    // }
    // cout << result;
    string s;
    cin >> s;
    
    vector<char> numbers;

    // Extract numbers from the string
    for (char c : s) {
        if (c != '+') {
            numbers.push_back(c);
        }
    }

    // Sort the numbers
    sort(numbers.begin(), numbers.end());

    // Construct the sorted output
    string result;
    for (size_t i = 0; i < numbers.size(); i++) {
        if (i > 0) cout << '+';  // Add '+' between numbers
        cout << numbers[i];
    }

    cout <<  endl;
}
int main()
{
    int tt;
    cin >> tt;
    while (tt--)
    {
        solve();
    }
    return 0;
}