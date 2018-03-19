package controller;

import java.sql.Connection;
import java.sql.DriverManager;

import java.sql.SQLException;


public class DataBase {

    static final String JDBC_DRIVER = "com.mysql.jdbc.Driver";
    static final String URL = "jdbc:mysql://127.0.0.1/annotation";
    static final String username = "root";
    static final String password = "root";

    public Connection getConnection() throws SQLException {
        Connection connection = null;
        try {
            Class.forName("com.mysql.jdbc.Driver");
            connection = DriverManager.getConnection(URL,username,password);
        } catch (ClassNotFoundException e) {
            e.printStackTrace();
        }
        return connection;
    }


}
