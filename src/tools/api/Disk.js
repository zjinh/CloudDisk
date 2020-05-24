import { Ajax, severAddress } from './request';
let FileType = {
	android: {
		TypeArray: 'apk',
		FileIcon: 'ApkType.png'
	},
	pdf: {
		TypeArray: 'pdf',
		FileIcon: 'PdfType.png'
	},
	torrent: {
		TypeArray: 'torrent',
		FileIcon: 'BtType.png'
	},
	vcf: {
		TypeArray: 'vcf',
		FileIcon: 'VcfType.png'
	},
	txt: {
		TypeArray: 'txt',
		FileIcon: 'TxtType.png'
	},
	html: {
		TypeArray: 'htm,html',
		FileIcon: 'html.png'
	},
	exe: {
		TypeArray: 'exe,msi',
		FileIcon: 'exe.png'
	},
	word: {
		TypeArray: 'doc,docx',
		FileIcon: 'DocType.png'
	},
	PowerPoint: {
		TypeArray: 'ppt,pptx',
		FileIcon: 'PptType.png'
	},
	excel: {
		TypeArray: 'xls,xlsx',
		FileIcon: 'ExcelType.png'
	},
	video: {
		TypeArray: 'mp4,rmvb,mkv',
		FileIcon: 'VideoType.png'
	},
	image: {
		TypeArray: 'apng,png,jpg,jpeg,bmp,gif',
		FileIcon: 'ImageType.png'
	},
	music: {
		TypeArray: 'm4a,mp3,ogg,flac,f4a,wav,ape,ncm',
		FileIcon: 'MusicType.png'
	},
	compress: {
		TypeArray: '7z,zip,rar,tar.gz',
		FileIcon: 'RarType.png'
	}
};
export default {
	LoadTreeFile(id, callback, error) {
		Ajax({
			url: '/service/disk/GetTreeFile',
			data: {
				disk_id: id
			},
			success: callback,
			error: error
		});
	},
	LoadMainFile(data, callback, error) {
		Ajax({
			url: '/service/disk/GetMainFile',
			data: data,
			success: rs => {
				rs.forEach(item => {
					this.DiskData(item);
				});
				callback(rs);
			},
			error: error
		});
	},
	UnZip(data, callback, error) {
		Ajax({
			url: '/service/disk/UnZipFile',
			data: data,
			success: rs => {
				rs[0] && rs[0].data ? this.DiskData(rs[0].data) : '';
				callback(rs);
			},
			error: error
		});
	},
	Search(data, callback, error) {
		data.loadtype = 'search';
		Ajax({
			url: '/service/disk/GetMainFile',
			data: data,
			success: rs => {
				rs.forEach(item => {
					this.DiskData(item);
				});
				callback(rs);
			},
			error: error
		});
	},
	NewFolder(data, callback, error) {
		Ajax({
			url: '/service/disk/NewFolder',
			data: data,
			success: rs => {
				rs.forEach(item => {
					this.DiskData(item);
				});
				callback(rs);
			},
			error: error
		});
	},
	Copy(data, callback, error) {
		Ajax({
			url: '/service/disk/CopyFile',
			data: data,
			success: callback,
			error: error
		});
	},
	Cut(data, callback, error) {
		Ajax({
			url: '/service/disk/MoveFile',
			data: data,
			success: callback,
			error: error
		});
	},
	Rename(data, callback, error) {
		Ajax({
			url: '/service/disk/RenameFile',
			data: data,
			success: callback,
			error: error
		});
	},
	Trash(data, callback, error) {
		Ajax({
			url: '/service/disk/TrashFile',
			data: data,
			success: callback,
			error: error
		});
	},
	Delete(data, callback, error) {
		Ajax({
			url: '/service/disk/DeleteFile',
			data: data,
			success: callback,
			error: error
		});
	},
	Restore(data, callback, error) {
		Ajax({
			url: '/service/disk/RestoreFile',
			data: data,
			success: callback,
			error: error
		});
	},
	Address(data, callback, error) {
		Ajax({
			url: '/service/disk/AddresFile/' + data,
			method: 'get',
			success: callback,
			error: error
		});
	},
	Share(data, callback, error) {
		Ajax({
			url: '/service/disk/ShareFile',
			data: data,
			success: callback,
			error: error
		});
	},
	CancelShare(data, callback, error) {
		Ajax({
			url: '/service/disk/CancelShareFile',
			data: data,
			success: callback,
			error: error
		});
	},
	OpenFile(data, callback, error) {
		Ajax({
			url: '/service/disk/OpenFile',
			data: data,
			success: callback,
			error: error
		});
	},
	GetLyr(data, callback, error) {
		Ajax({
			url: '/service/api/disk/lrc',
			data: data,
			success: callback,
			error: error
		});
	},
	Download(data, callback, error) {
		Ajax({
			url: '/service/disk/Download',
			data: data,
			success: callback,
			error: error
		});
	},
	Upload(data, callback, error) {
		Ajax({
			url: '/service/disk/upload',
			data: data,
			upload: true,
			success: rs => {
				rs.data ? this.DiskData(rs.data) : '';
				callback(rs);
			},
			error: error
		});
	},
	FileSize(bytes) {
		bytes = parseFloat(bytes);
		if (bytes === 0) return '0B';
		let k = 1024,
			sizes = ['B', 'KB', 'MB', 'GB', 'TB'],
			i = Math.floor(Math.log(bytes) / Math.log(k));
		return (bytes / Math.pow(k, i)).toPrecision(3) + sizes[i];
	},
	DiskData(item) {
		item.active = false; //设置未选择
		item.$size = this.FileSize(item.disk_size); //计算文件大小
		item.disk_size = parseInt(item.disk_size);
		item.disk_main ? (item.disk_main = severAddress() + '/' + item.disk_main) : '';
		item.shareAddress = item.share ? severAddress() + '/s/' + item.share : '';
		item.$icon = 'OtherType.png'; //初始化为其他图标
		item.OpenType = null; //初始化为无法打开的文件
		let type = (item.disk_realname || item.disk_main).Before('.').toLowerCase();
		item.type = type;
		if (item.disk_main) {
			for (let i in FileType) {
				if (type.Exist(FileType[i].TypeArray)) {
					item.$icon = FileType[i].FileIcon;
				}
			}
			if (item.type === 'zip') {
				item.OpenType = 'zip';
			} else if (item.type === 'pdf') {
				item.OpenType = 'pdf';
			} else if (item.type.Exist('apng,png,jpg,jpeg,bmp,gif')) {
				item.TypeArray = 'apng,png,jpg,jpeg,bmp,gif';
				item.OpenType = 'image';
			} else if (item.type.Exist('mp4,rmvb,mkv')) {
				item.TypeArray = 'mp4,rmvb,mkv';
				item.OpenType = 'video';
			} else if (item.type.Exist('m4a,mp3,ogg,flac,f4a,wav,ape')) {
				item.TypeArray = 'm4a,mp3,ogg,flac,f4a,wav,ape';
				item.OpenType = 'audio';
			} else if (item.type.Exist('ini,txt,xml,aspx,php,phtml,js,c,htm,html,log,c,cpp,java')) {
				item.OpenType = 'text';
			}
		} else {
			item.$icon = 'FolderType.png';
		}
	}
};
