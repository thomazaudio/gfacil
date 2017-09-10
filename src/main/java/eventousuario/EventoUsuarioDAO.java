package eventousuario;
import java.sql.Connection;
import java.sql.PreparedStatement;
import java.sql.SQLException;
import java.sql.Timestamp;

import org.springframework.stereotype.Repository;

import transactional.SendEmail;
import database.DataBaseUtil;
import model.GenericDAO;

@Repository
public class EventoUsuarioDAO extends GenericDAO<EventoUsuario> {

	public EventoUsuarioDAO() {
		super(EventoUsuario.class);
		// TODO Auto-generated constructor stub
	}



	@Override
	public EventoUsuario addOrUpdate(EventoUsuario evt) {
		
		
		if(evt.getEvento().equals("erro_cache_post"))
			new SendEmail().enviaEmailErroCachePost(evt);
		
		Connection con = DataBaseUtil.getConnection();

		PreparedStatement stm =null;

		try {
            //Os eventos sempre serão salvos em db_shared
			con.createStatement().execute("use db_shared");			
			stm = con.prepareStatement("insert into eventousuario(login,evento,url,descricao,disable,hora,dataCadastro,pathOrigem,urlMethod,idFilial,allFilials,descricao_2) values(?,?,?,?,?,?,?,?,?,?,?,?)");
			stm.setString(1,evt.getLogin());
			stm.setString(2,evt.getEvento());
			stm.setString(3,evt.getUrl());
			stm.setString(4,evt.getDescricao());
			stm.setInt(5,0);
			stm.setTimestamp(6,new Timestamp(System.currentTimeMillis()));
			stm.setTimestamp(7,new Timestamp(System.currentTimeMillis()));
			stm.setString(8,evt.getPathOrigem());
			stm.setString(9,evt.getUrlMethod());
			stm.setLong(10,0);
			stm.setLong(11,1);
			stm.setString(12,evt.getDescricao_2());

			stm.execute();

		} catch (SQLException e) {
			// TODO Auto-generated catch block
			e.printStackTrace();
		}finally{
			try {
				stm.close();
			} catch (SQLException e) {
				// TODO Auto-generated catch block
				e.printStackTrace();
			}
		}
		
		return evt;

	}

}


