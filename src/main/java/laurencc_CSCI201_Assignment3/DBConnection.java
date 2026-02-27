package laurencc_CSCI201_Assignment3;

import java.sql.Connection;
import java.sql.DriverManager;
import java.sql.ResultSet;
import java.sql.SQLException;
import java.sql.Statement;
import java.util.ArrayList;
import java.util.Collections;
import java.util.List;

// most code taken from example and labs
public class DBConnection {
	public static int registerUser(String username, String password) {
		
		try {
			Class.forName("com.mysql.cj.jdbc.Driver");
		}
		catch (ClassNotFoundException e) {
			e.printStackTrace();
		}
		
	    int userID = -1;
	    Connection conn = null;
	    Statement st = null;
	    ResultSet rs = null;
	    

	    try {
	    	conn = DriverManager.getConnection("jdbc:mysql://localhost/Assignment3?user=PLACEHOLDER&password=PLACEHOLDER");
	    	
	    	st = conn.createStatement();
	    	rs = st.executeQuery("SELECT * FROM users WHERE username='" + username + "'");
	    	if (!rs.next()) { // if no record found, username is available
	            rs.close();
	            st.execute("INSERT INTO users (username, pass) VALUES ('" + username + "', '" + password + "')");
	            rs = st.executeQuery("SELECT LAST_INSERT_ID()");
	            rs.next();
	            userID = rs.getInt(1);
	        } 
	    	// else: username exists already
	    	
	    }  
	    catch (SQLException e) {
	        System.out.println("SQLException in registerUser: " + e.getMessage());
	        e.printStackTrace();
	    } 
	    catch (Exception e) {
	        System.out.println("Exception in registerUser: " + e.getMessage());
	        e.printStackTrace();
	    }
	    finally {
	    	try {
	    		if (rs != null) {
	    			rs.close();
	    		}
	    		if (st != null) {
	    			st.close();
	    		}
	    		if (conn != null) {
	    			conn.close();
	    		}
	    	}
	    	catch (SQLException e) {
	    		System.out.println("Closing error: " + e.getMessage());
	    	}
	    }

	    return userID;
	}
	
	public static int loginUser(String username, String password) {
		
		try {
			Class.forName("com.mysql.cj.jdbc.Driver");
		}
		catch (ClassNotFoundException e) {
			e.printStackTrace();
		}
		
	    int userID = -1;
	    Connection conn = null;
	    Statement st = null;
	    ResultSet rs = null;
	    

	    try {
	    	conn = DriverManager.getConnection("jdbc:mysql://localhost/Assignment3?user=PLACEHOLDER&password=PLACEHOLDER");
	    	
	    	st = conn.createStatement();
	    	rs = st.executeQuery("SELECT * FROM users WHERE username='" + username + "'");
	    	if (!rs.next()) { // if no record found, user does not exist
	            rs.close();
	        } 
	    	else { // if the user exists
	    		// must check if password is correct
	    		String savedPass = rs.getString("pass");
	    		if (savedPass.equals(password)) {
	    			userID = rs.getInt("user_id");
	    		}
	    		else {
	    			userID = -2;
	    		}
	    	}
	    	
	    }  
	    catch (SQLException e) {
	        System.out.println("SQLException in loginUser: " + e.getMessage());
	        e.printStackTrace();
	    } 
	    catch (Exception e) {
	        System.out.println("Exception in loginUser: " + e.getMessage());
	        e.printStackTrace();
	    }
	    finally {
	    	try {
	    		if (rs != null) {
	    			rs.close();
	    		}
	    		if (st != null) {
	    			st.close();
	    		}
	    		if (conn != null) {
	    			conn.close();
	    		}
	    	}
	    	catch (SQLException e) {
	    		System.out.println("Closing error: " + e.getMessage());
	    	}
	    }

	    return userID;
	}
	
	public static boolean addSearch(String username, String query) {
		
		try {
			Class.forName("com.mysql.cj.jdbc.Driver");
		}
		catch (ClassNotFoundException e) {
			e.printStackTrace();
		}
	    Connection conn = null;
	    Statement st = null;
	    ResultSet rs = null;

	    try {
	    	conn = DriverManager.getConnection("jdbc:mysql://localhost/Assignment3?user=PLACEHOLDER&password=PLACEHOLDER");
	    	
	    	// get user id
	    	st = conn.createStatement();
	    	rs = st.executeQuery("SELECT * FROM users WHERE username='" + username + "'");
	    	// System.out.println("username given: " + username);
	    	rs.next();
	    	int id = rs.getInt("user_id"); // always available at this point
	  
	    	st = conn.createStatement();
	    	st.executeUpdate("INSERT INTO searches (user_id, search_query) VALUES (" + id + ", '" + query + "')");
	    }  
	    catch (SQLException e) {
	        System.out.println("SQLException in adding search: " + e.getMessage());
	        e.printStackTrace();
	    } 
	    catch (Exception e) {
	        System.out.println("Exception in adding search: " + e.getMessage());
	        e.printStackTrace();
	    }
	    finally {
	    	try {
	    		if (rs != null) {
	    			rs.close();
	    		}
	    		if (st != null) {
	    			st.close();
	    		}
	    		if (conn != null) {
	    			conn.close();
	    		}
	    	}
	    	catch (SQLException e) {
	    		System.out.println("Closing error: " + e.getMessage());
	    	}
	    }
	    return true;
	}
	
public static List<String> getHistory(String username) {
		
		try {
			Class.forName("com.mysql.cj.jdbc.Driver");
		}
		catch (ClassNotFoundException e) {
			e.printStackTrace();
		}
	    Connection conn = null;
	    Statement st = null;
	    ResultSet rs = null;
	    List<String> searchHistory = new ArrayList<>();

	    try {
	    	conn = DriverManager.getConnection("jdbc:mysql://localhost/Assignment3?user=PLACEHOLDER&password=PLACEHOLDER");
	    	
	    	// get user id
	    	st = conn.createStatement();
	    	rs = st.executeQuery("SELECT * FROM users WHERE username='" + username + "'");
	    	rs.next();
	    	int id = rs.getInt("user_id"); // always available at this point
	  
	    	st = conn.createStatement();
	    	rs = st.executeQuery("SELECT search_query FROM searches WHERE user_id='" + id + "'");
	    	
	    	while (rs.next()) {
	            String searchQuery = rs.getString("search_query");
	            searchHistory.add(searchQuery);
	        }
	    	Collections.reverse(searchHistory);
	    }  
	    catch (SQLException e) {
	        System.out.println("SQLException in getting history: " + e.getMessage());
	        e.printStackTrace();
	    } 
	    catch (Exception e) {
	        System.out.println("Exception in getting history: " + e.getMessage());
	        e.printStackTrace();
	    }
	    finally {
	    	try {
	    		if (rs != null) {
	    			rs.close();
	    		}
	    		if (st != null) {
	    			st.close();
	    		}
	    		if (conn != null) {
	    			conn.close();
	    		}
	    	}
	    	catch (SQLException e) {
	    		System.out.println("Closing error: " + e.getMessage());
	    	}
	    }
	    return searchHistory;
	}
}
