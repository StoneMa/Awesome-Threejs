package controller;

import bean.Annotation;
import org.springframework.orm.jpa.vendor.Database;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.ResponseBody;

import java.sql.*;
import java.util.ArrayList;
import java.util.List;

@Controller
public class AnnotationController {
    @ResponseBody
    @RequestMapping(value = "/addAnnos.do", method = RequestMethod.POST)
    public String add(@RequestParam("title") String title,
                      @RequestParam("content") String content,
                      @RequestParam("id") String id,
                      @RequestParam("x_point") String x_point,
                      @RequestParam("y_point") String y_point,
                      @RequestParam("z_point") String z_point){
        System.out.println(title);
        System.out.println(content);
        System.out.println(id);
        String sql = "insert into annotation (id, title, content, x, y, z) values (?,?,?,?,?,?)";
        DataBase dao = new DataBase();
        Connection connection = null;
        PreparedStatement statement = null;
        Boolean flag = false;
        try {
            connection = dao.getConnection();
            statement = connection.prepareStatement(sql);
            statement.setString(1,id);
            statement.setString(2,title);
            statement.setString(3,content);
            statement.setFloat(4, Float.parseFloat(x_point));
            statement.setFloat(5, Float.parseFloat(y_point));
            statement.setFloat(6, Float.parseFloat(z_point));
            flag = statement.execute();
            statement.close();
        } catch (SQLException e) {
            e.printStackTrace();
        }finally {
            try {
                connection.close();
            } catch (SQLException e) {
                e.printStackTrace();
            }
        }
        return selectId(title,content);
    }

    /**
     * 这方法其实不需要了，先这样吧。
     * @param title
     * @param content
     * @return
     */
    @ResponseBody
    public String selectId(String title, String content){
        String id = "";
        String sql = "select id from annotation where title = ? and content = ?";
        DataBase dao = new DataBase();
        Connection connection = null;
        PreparedStatement statement = null;
        ResultSet resultSet = null;
        try {
            connection = dao.getConnection();
            statement = connection.prepareStatement(sql);
            statement.setString(1,title);
            statement.setString(2,content);
            resultSet = statement.executeQuery();
            if (resultSet.next()){
                id = resultSet.getString("id");
            }
        } catch (SQLException e) {
            e.printStackTrace();
        }
        return id;
    }

    /**
     * 查找所有已存在的annotation的坐标
     * @return
     */
    @ResponseBody
    @RequestMapping(value = "/queryAnnos.do", method = RequestMethod.POST)
    public List<Annotation> queryAnnos(){
        String sql = "select * from annotation";
        DataBase dao = new DataBase();
        Connection connection = null;
        PreparedStatement statement = null;
        ResultSet resultSet = null;
        List<Annotation> annotationList = new ArrayList<Annotation>();
        try {
            connection = dao.getConnection();
            statement = connection.prepareStatement(sql);
            resultSet = statement.executeQuery();
            while (resultSet.next()){
                Annotation annotation = new Annotation();
                annotation.setId(resultSet.getInt("id"));
                annotation.setTitle(resultSet.getString("title"));
                annotation.setContent(resultSet.getString("content"));
                annotation.setX(resultSet.getFloat("x"));
                annotation.setY(resultSet.getFloat("y"));
                annotation.setZ(resultSet.getFloat("z"));
                annotationList.add(annotation);
            }
            resultSet.close();
            statement.close();
        } catch (SQLException e) {
            e.printStackTrace();
        }finally {
            try {
                connection.close();
            } catch (SQLException e) {
                e.printStackTrace();
            }
        }
        return annotationList;
    }
}
