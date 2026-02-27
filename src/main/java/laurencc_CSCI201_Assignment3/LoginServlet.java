package laurencc_CSCI201_Assignment3;

import java.io.IOException;
import java.io.PrintWriter;
import javax.servlet.ServletException;
import javax.servlet.annotation.WebServlet;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import com.google.gson.Gson;

@WebServlet("/LoginServlet")

public class LoginServlet extends HttpServlet {

	private static final long serialVersionUID = 1L;
	
	@Override
	protected void doPost(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {
	    PrintWriter pw = response.getWriter();
	    response.setContentType("application/json");
	    response.setCharacterEncoding("UTF-8");
	    
	    User user = new Gson().fromJson(request.getReader(), User.class);
	    
	    String username = user.username;
	    String password = user.pass;
	    
	    Gson gson = new Gson();
	    
	    if (username == null || username.isBlank() 
                || password == null || password.isBlank()) {
            response.setStatus(HttpServletResponse.SC_BAD_REQUEST);
            String error = "User info is missing.";
            pw.write(gson.toJson(error));
            pw.flush();
            return;
        }
	    
	    int userID = DBConnection.loginUser(username, password);
	    
	    if (userID == -2) {
            response.setStatus(HttpServletResponse.SC_BAD_REQUEST);
            String error = "Incorrect password.";
            pw.write(gson.toJson(error));
            pw.flush();
        } 
	    else if (userID == -1) {
            response.setStatus(HttpServletResponse.SC_BAD_REQUEST);
            String error = "This user does not exist.";
            pw.write(gson.toJson(error));
            pw.flush();
        }
	    else {
            response.setStatus(HttpServletResponse.SC_OK);
            pw.write(gson.toJson(userID));
            pw.flush();
        }
	}
}
