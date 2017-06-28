package filial;
import java.io.File;
import java.io.IOException;

import org.hibernate.Query;
import org.springframework.stereotype.Repository;
import org.springframework.web.multipart.MultipartFile;

import model.GenericDAO;
import system.SystemUtil;

@Repository
public class FilialDAO extends GenericDAO<Filial> {

	public FilialDAO() {
		super(Filial.class);
		// TODO Auto-generated constructor stub
	}

	public String uploadCertificado(MultipartFile file,String senha){

		String rootDirectory = SystemUtil.getBaseDirCurrentUser();

		File root = new File(rootDirectory);
		if(!root.exists())
			root.mkdirs();
		
		
		Long idFilial = SystemUtil.getCurrentUserDetails().getAccount().getCurrentFilialId();
		
		//Conveção de nome para certificado armazenados no sistema
		String nomeCertificado  = "certificado_"+idFilial+".pfx";
		
		String pathCertificado = rootDirectory  + nomeCertificado;

		//Salva o certificado no diretorio
		try {
			file.transferTo(new File(pathCertificado));
		} catch (IllegalStateException e) {
			// TODO Auto-generated catch block
			e.printStackTrace();
		} catch (IOException e) {
			// TODO Auto-generated catch block
			e.printStackTrace();
		}
		
		
		//Atualiza as informações do certificado na entidade Filial
		Query q  = this.getSessionFactory().getCurrentSession().createQuery("UPDATE Filial SET pathCertificado=:path, senhaCertificado=:senhaCertificado, nomeCertificado=:nomeCertificado where id = :idFilial");
		q.setString("senhaCertificado",senha);
		q.setString("nomeCertificado",file.getOriginalFilename());
		q.setString("path",pathCertificado);
		q.setLong("idFilial", idFilial);
		q.executeUpdate();
		
		
		return file.getOriginalFilename();
		
	}

}
