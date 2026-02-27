package laurencc_CSCI201_Assignment3;

import java.io.IOException;
import java.io.PrintWriter;
import java.util.List;

import javax.servlet.ServletException;
import javax.servlet.annotation.WebServlet;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import com.google.gson.Gson;

@WebServlet("/WeatherServlet")

public class WeatherServlet extends HttpServlet {

	private static final long serialVersionUID = 1L;
	
	@Override
	protected void doPost(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {
	    PrintWriter pw = response.getWriter();
	    response.setContentType("application/json");
	    response.setCharacterEncoding("UTF-8");
	    
	    Search searchQuery = new Gson().fromJson(request.getReader(), Search.class);
	    
        String user = searchQuery.username;
        String query = searchQuery.query;
        
        Gson gson = new Gson();
	    
        boolean ok = DBConnection.addSearch(user, query);
        
        if (!ok) {
            response.setStatus(HttpServletResponse.SC_BAD_REQUEST);
            String error = "Could not add search.";
            pw.write(gson.toJson(error));
            pw.flush();
        }
	    else {
            response.setStatus(HttpServletResponse.SC_OK);
            pw.write(gson.toJson(ok));
            pw.flush();
        }
	}
	
	@Override
    protected void doGet(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {
		PrintWriter pw = response.getWriter();
	    response.setContentType("application/json");
	    response.setCharacterEncoding("UTF-8");
	   
        String user = request.getParameter("username");
        
        Gson gson = new Gson();
	    
        List<String> searchHistory = DBConnection.getHistory(user);
        
        if (searchHistory == null) {
            response.setStatus(HttpServletResponse.SC_BAD_REQUEST);
            String error = "Could not get search history.";
            pw.write(gson.toJson(error));
            pw.flush();
        }
	    else {
            response.setStatus(HttpServletResponse.SC_OK);
            pw.write(gson.toJson(searchHistory));
            pw.flush();
        }
    }
}



