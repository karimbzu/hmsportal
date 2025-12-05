cmake_minimum_required(VERSION 3.10)
project(crow_sqlite_crud)

set(CMAKE_CXX_STANDARD 17)

find_package(Threads REQUIRED)

add_executable(crow_sqlite_crud main.cpp)

target_include_directories(crow_sqlite_crud PRIVATE include)  # Crow headers here
target_link_libraries(crow_sqlite_crud PRIVATE sqlite3 Threads::Threads)
