package filial;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;

import model.GenericService;

@Service
public class FilialService extends GenericService<Filial>{

	@Autowired
	private FilialDAO dao;
	
	@Transactional
	public String uploadCertificado(MultipartFile file,String senha){
	
		return dao.uploadCertificado(file,senha);
	}
	
}
