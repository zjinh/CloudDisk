<template>
	<section
		class="cd-main"
		@keydown.stop.ctrl.67="isDisk ? DiskFeatureControl('Copy') : ''"
		@keydown.stop.ctrl.88="isDisk ? DiskFeatureControl('Cut') : ''"
		@keydown.stop.ctrl.86="isDisk ? DiskFeatureControl('paste') : ''"
		@keydown.stop.ctrl.85="isDisk ? DiskFeatureControl('upload') : ''"
		@keydown.stop.ctrl.82="isTrash ? DiskFeatureControl('restore') : ''"
		@keydown.exact.stop.46="isDisk ? DiskFeatureControl('trash') : ''"
		@keydown.stop.ctrl.46="isTrash ? DiskFeatureControl('delete') : ''"
		@keydown.stop.ctrl.79="isDisk ? DiskFeatureControl('open', '') : ''"
		@keydown.stop.ctrl.77="isDisk ? DiskFeatureControl('rename') : ''"
		@keydown.exact.stop.113="isDisk ? DiskFeatureControl('rename') : ''"
		@keydown.stop.alt.enter="isDisk ? DiskFeatureControl('info') : ''"
		@keydown.stop.ctrl="DiskData.KeyFlag = 'Ctrl'"
		@keydown.stop.shift="DiskData.KeyFlag = 'Shift'"
		@keyup="DiskData.KeyFlag = null"
		tabindex="1"
		ref="CloudDiskMain"
	>
		<DiskClassify :type="DiskData.Type" :DiskData="DiskData" :show="NoTransType" @callback="SwitchClassify" @change="SwitchClassify" ref="DiskClassify" />
		<section class="cd-right" v-if="login">
			<DiskHeader :data="DiskData" :count="DownloadCount + UploadCount" @callback="SwitchType" />
			<DiskNavigation :data="DiskData" :loading="LoadCompany" :hide="NeedHide" @callback="NavigationControl" @feature="DiskFeatureControl" />
			<DiskRecoverBar :show="isTrash" :disabled="UserDiskData.length === 0" @callback="UserDiskData = []" />
			<DiskSortBar
				:show="DiskData.DiskShowState !== 'cd-disk-block-file' && NoTransType"
				:DiskData="UserDiskData"
				@callback="DiskFeatureControl"
				ref="DiskSortBar"
			/>
			<section
				class="cd-bottom"
				@scroll="LoadMore"
				@mousedown="MainMouseFunc"
				@dragover.prevent.stop="ShowUploadTips = true"
				@dragleave.prevent.stop="ShowUploadTips = false"
				@drop.prevent.stop="UploadDrop"
				ref="CloudDiskMain"
				:style="{ height: AutoHeight }"
			>
				<div class="cd-upload-tips" v-show="ShowUploadTips && DiskData.Type === 'disk' && loadClassify === 'normal'">松开鼠标开始上传文件</div>
				<DiskFile @SelectFiles="SelectFiles" @OpenFile="DiskFeatureControl" v-if="LoadCompany && NoTransType" :data="UserDiskData" :DiskData="DiskData" />
				<loading :loading="IsLoadCompany" :length="UserDiskData.length" :IsNoDiskData="IsNoDiskData" />
				<div class="cd-mouse-select" v-show="MouseSelectData.width" :style="MouseSelectData" />
				<DiskTransList v-show="DiskData.Type === 'trans'" :data="TransformData" @ControlTrans="ControlTrans" />
			</section>
			<input type="file" id="FileArea" @change="PrepareUploadFile" hidden ref="FileArea" multiple="multiple" />
			<audio :src="NoticeSrc" ref="NoticeAudio" />
			<MouseMenu :type="loadClassify" :node="$refs.CloudDiskMain" :DiskData="DiskData" @callback="DiskFeatureControl" ref="MouseMenu" />
			<el-dialog title="选择目标文件夹" :visible.sync="showTree" width="350px">
				<div style="height: 200px; overflow: auto">
					<DiskTree v-if="showTree" @SelectDiskTree="SelectDiskTree" />
				</div>
				<span slot="footer" class="dialog-footer">
					<button class="cd-button cd-cancel-button" @click="showTree = false">取 消</button>
					<button class="cd-purple-button" @click="DiskMoveUp" v-if="!ShowUnZip">确 定</button>
					<button class="cd-purple-button" @click="DiskUnZip" v-if="ShowUnZip">解 压</button>
				</span>
			</el-dialog>
			<el-dialog title="分享方式" :visible.sync="showShare" width="350px" top="150px">
				<div style="height: 150px;">
					<p class="cd-share-select">
						准备分享<span>{{ DiskData.NowSelect.disk_name }}</span>
					</p>
					<DiskShare v-if="showShare" @close="showShare = false" @callback="DiskFeatureControl" ref="DiskShareModel" />
				</div>
				<span slot="footer" class="dialog-footer">
					<button class="cd-button cd-cancel-button" @click="showShare = false">取 消</button>
					<button class="cd-purple-button" @click="DiskFeatureControl('post-share')">确 定</button>
				</span>
			</el-dialog>
		</section>
	</section>
</template>

<script>
import DiskHeader from '../components/DiskWindow/DiskHeader'; //拖拽头部
import DiskNavigation from '../components/DiskWindow/DiskNavigation'; //网盘导航栏
import DiskClassify from '../components/DiskWindow/DiskClassify'; //网盘左侧导航栏
import DiskRecoverBar from '../components/DiskWindow/DiskRecoverBar'; //回收站提示栏
import DiskSortBar from '../components/DiskWindow/DiskSortBar'; //排序工具栏
import DiskFile from '../components/DiskWindow/DiskFile'; //网盘文件块
import DiskTree from '../components/DiskWindow/DiskTree'; //树目录
import DiskShare from '../components/DiskWindow/DiskShare'; //文件分享
import DiskTransList from '../components/DiskWindow/DiskTransList'; //下载列表
import loading from '../components/DiskWindow/loading'; //加载
import MouseMenu from '../components/DiskWindow/MouseMenu'; //右键菜单
import upload from '../tools/file/upload';
export default {
	name: 'DiskWindow',
	components: {
		DiskHeader,
		DiskNavigation,
		DiskClassify,
		DiskRecoverBar,
		DiskSortBar,
		DiskFile,
		DiskTree,
		DiskShare,
		DiskTransList,
		loading,
		MouseMenu
	},
	data() {
		return {
			DiskData: {
				ClipboardType: false, //剪切板是复制还是剪切
				Clipboard: [], //剪切板的文件
				SelectFiles: [], //选择的文件
				NavData: [], //记录导航栏数据
				KeyFlag: false, //全局键盘记录
				NowSelect: {}, //记录一个选择的文件
				DiskShowState: 'cd-disk-block-file', //文件显示类型，默认图标,
				SelectTips: '0个项目', //选择文件提示
				Type: 'disk', //头部分类标签,
				ClassifyName: '网盘', //地址栏左侧分类显示文本,
				DiskSize: {
					/*网盘大小*/
					total: 0,
					use: 0,
					Percent: '0%',
					Background: '#2682fc',
					text: '0B/0B'
				}
			},
			UserDiskData: [], //存放用户网盘数据
			DiskPage: 1, //网盘加载的页数
			loadClassify: 'normal', //网盘加载的分类
			LoadCompany: false, //是否加载完成
			NeedHide: false, //是否需要隐藏菜单
			/*网盘一些记录的参数*/
			DiskPosting: false,
			NowDiskID: null,
			DiskAllCount: 0,
			DiskLoadCount: 0,
			/*树目录参数*/
			showTree: false,
			SelectTrees: false,
			/*解压到参数*/
			ShowUnZip: false,
			/*分享窗口参数*/
			showShare: false,
			/*拖拽选择参数*/
			MouseSelectData: {
				left: 0,
				top: 0,
				width: 0,
				height: 0
			},
			/*上传提示*/
			ShowUploadTips: false,
			/*文件传输列表参数*/
			TransformData: [],
			SelectDownLoadFiles: [], //选择下载的文件
			UploadCount: 0, //上传技术
			DownloadCount: 0, //下载计数
			FinishCount: 0, //完成计数
			NoticeSrc: '',
			ConfigObject: {
				NoticeFlag: true,
				NoticeBubble: true
			},
			login: false,
			UserInfo: {}
		};
	},
	watch: {
		NeedHide: {
			handler() {
				let a = null;
				clearTimeout(a);
				a = setTimeout(() => {
					this.NeedHide = false;
				}, 1000);
			}
		},
		UserDiskData: {
			handler() {
				this.NeedHide = true;
				this.DiskData.SelectFiles = [];
				this.UserDiskData.forEach((item, index) => {
					if (item.active) {
						item.index = index;
						this.DiskData.SelectFiles.push(item);
					}
				});
				if (this.DiskData.SelectFiles.length) {
					this.DiskData.SelectTips = '选中' + this.DiskData.SelectFiles.length + '个项目';
				} else {
					this.DiskData.SelectTips = this.UserDiskData.length + '个项目';
				}
			},
			deep: true
		},
		loadClassify: {
			handler() {
				if (this.DiskData.Type === 'trans') {
					this.$nextTick(() => {
						this.TransformData.forEach(item => {
							item.shows = this.loadClassify === item.state || (item.trans_type === this.loadClassify && item.state !== 'completed');
						});
					});
				}
			},
			deep: true
		},
		TransformData: {
			handler() {
				this.$nextTick(() => {
					this.UploadCount = 0;
					this.DownloadCount = 0;
					this.FinishCount = 0;
					this.TransformData.forEach((item, index) => {
						if (item.state === 'cancelled') {
							this.TransformData.splice(index, 1);
						}
						if (item.trans_type === 'upload' && item.state !== 'completed') {
							this.UploadCount++;
						}
						if (item.trans_type === 'download' && item.state !== 'completed') {
							this.DownloadCount++;
						}
						if (item.state === 'completed') {
							this.FinishCount++;
						}
						item.shows = this.loadClassify === item.state || (item.trans_type === this.loadClassify && item.state !== 'completed');
					});
					this.$refs.DiskClassify.TransData[0].count = this.DownloadCount;
					this.$refs.DiskClassify.TransData[1].count = this.UploadCount;
					this.$refs.DiskClassify.TransData[2].count = this.FinishCount;
				});
				this.$Api.LocalFile.write('transfer', this.TransformData);
			},
			deep: true
		}
	},
	computed: {
		isDisk() {
			return (
				this.loadClassify !== 'trash' &&
				this.DiskData.Type === 'disk' &&
				(this.DiskData.SelectFiles.length > 1 || this.DiskData.NowSelect.disk_id !== undefined)
			);
		},
		isTrash() {
			return (
				this.loadClassify === 'trash' &&
				this.DiskData.Type === 'disk' &&
				(this.DiskData.SelectFiles.length > 1 || this.DiskData.NowSelect.disk_id !== undefined)
			);
		},
		/**
		 * @return {boolean}
		 */
		NoTransType() {
			return this.DiskData.Type !== 'trans';
		},
		IsLoadCompany() {
			return !this.LoadCompany && this.NoTransType;
		},
		IsNoDiskData() {
			return this.LoadCompany && this.NoTransType;
		},
		/**
		 * @return {string}
		 */
		AutoHeight() {
			return (
				'calc(100% - 120px - ' +
				(this.isTrash ? '32ppx' : '0') +
				(this.DiskData.DiskShowState !== 'cd-disk-block-file' && this.NoTransType ? '32px' : '0px') +
				')'
			);
		}
	},
	created() {
		this.Bind();
		this.NoticeSrc = localStorage.NoticeVoice;
	},
	methods: {
		/*初始化*/
		Bind: function() {
			window.addEventListener(
				'dragenter',
				function(e) {
					e.preventDefault();
				},
				false
			);
			window.addEventListener(
				'dragover',
				function(e) {
					e.preventDefault();
				},
				false
			);
			window.addEventListener(
				'dragleave',
				function(e) {
					e.preventDefault();
				},
				false
			);
			window.addEventListener(
				'drop',
				function(e) {
					e.preventDefault();
				},
				false
			);
			localStorage.server = this.$Api.Public.severAddress();
			this.$ipc.on('download', (e, file, completed) => {
				completed && this.DiskFeatureControl('popup', file.name + '下载完成'); /*消息提醒*/
				for (let i = 0; i < this.TransformData.length; i++) {
					if (file.name === this.TransformData[i].name) {
						this.$nextTick(() => {
							for (let name in this.TransformData[i]) {
								this.TransformData[i][name] = file[name];
							}
						});
						return;
					}
				}
				this.$nextTick(() => {
					this.TransformData.push(file);
				});
			});
			this.$ipc.on('win-data', (e, data) => {
				//接收用户配置文件
				localStorage.UserId = data.id;
				this.$Api.User.Login(
					data,
					() => {
						this.login = true;
						this.GetMainFile(null, this.loadClassify);
						this.$Api.LocalFile.read('transfer', data => {
							if (data.length) {
								this.TransformData = data;
								this.TransformData.forEach(item => {
									if (item.trans_type === 'download' && item.state !== 'completed') {
										this.$electron.remote.getCurrentWindow().webContents.downloadURL(item.disk_main + '?disk_name=' + item.disk_name);
									}
								});
							}
						});
						this.$Api.LocalFile.read('setting', data => {
							this.ConfigObject = data;
							this.$ipc.send('system', 'download-update', data.TransDownFolder);
						});
					},
					() => {
						this.$ipc.send('system', 'logoff');
					}
				);
			});
		},
		/*导航栏函数*/
		NavigationControl(commend) {
			switch (commend) {
				case 'back': //后退
					if (this.DiskData.NavData.length > 1) {
						this.NavigationControl(this.DiskData.NavData[this.DiskData.NavData.length - 2]);
					} else {
						this.NavigationControl('home');
					}
					break;
				case 'home': //返回顶层
					if (this.DiskData.Type === 'share') {
						this.SwitchType('share');
						this.NavigationControl('clear');
					} else if (this.NoTransType && this.DiskData.ClassifyName !== '搜索') {
						this.GetMainFile(null, this.loadClassify);
						this.NavigationControl('clear');
					} else if (this.DiskData.ClassifyName === '搜索') {
						this.SwitchType('disk');
						this.NavigationControl('clear');
					}
					break;
				case 'reload': //刷新
					this.DiskPage = 1;
					this.GetMainFile(this.NowDiskID, this.loadClassify);
					break;
				case 'clear':
					this.DiskData.NavData = [];
					break;
				default:
					//默认切换
					for (let i = this.DiskData.NavData.length - 1; i > 0; i--) {
						if (commend === this.DiskData.NavData[i]) {
							break;
						}
						this.DiskData.NavData.splice(i, 1);
					}
					this.GetMainFile(commend.disk_id, 'normal');
					break;
			}
		},
		/*切换顶部网盘分享、传输类型*/
		SwitchType(type) {
			this.NavigationControl('clear');
			this.DiskData.Type = type;
		},
		/*切换左侧网盘导航*/
		SwitchClassify(type, item) {
			this.UserDiskData = []; //清空数据
			this.DiskData.ClassifyName = item.name === '全部文件' ? '网盘' : item.name;
			this.loadClassify = item.data;
			this.DiskPage = 1;
			if (type !== 'trans') {
				this.GetMainFile(null, this.loadClassify);
			}
			this.SwitchType(type);
		},
		/*网盘功能控制*/
		DiskFeatureControl(commend, datas, flag) {
			let data = null;
			if (commend === 'Copy' || commend === 'Cut') {
				this.DiskFeatureControl('clear');
				if (this.DiskData.SelectFiles.length) {
					this.DiskData.Clipboard = this.DiskData.SelectFiles;
				} else if (this.DiskData.NowSelect.disk_id) {
					this.DiskData.Clipboard.push(this.DiskData.NowSelect);
				}
				let tips = this.DiskData.Clipboard.length > 1 ? '所选' + this.DiskData.Clipboard.length + '个项目' : this.DiskData.NowSelect.disk_name;
				switch (commend) {
					case 'Copy':
						tips = tips + '已复制到剪贴板';
						break;
					case 'Cut':
						tips = tips + '已剪切到剪贴板';
						break;
				}
				this.$Message.info(tips);
				return (this.DiskData.ClipboardType = commend);
			}
			commend = commend ? commend : 'newFolder';
			switch (commend) {
				case 'open' /*打开文件夹/文件*/:
					let item = datas;
					if (!item) {
						item = this.DiskData.NowSelect;
					}
					if (!item.disk_main) {
						this.DiskData.NavData.push(item);
						this.ClearSelect();
						this.GetMainFile(item.disk_id, 'normal');
					} else {
						let OpenType = this.DiskData.NowSelect.OpenType;
						if (OpenType === 'zip') {
							this.showTree = true;
							this.ShowUnZip = true;
						} else if (OpenType !== null) {
							let data = [];
							if (OpenType === 'image' || OpenType === 'video' || OpenType === 'audio') {
								this.UserDiskData.forEach(file => {
									if (file.type.Exist(item.TypeArray)) {
										data.push(file);
									}
								});
							}
							this.$ipc.send('file-control', OpenType, data.length ? data : this.DiskData.NowSelect);
						} else {
							this.$Message.warning('暂不支持打开该类型文件');
						}
					}
					break;
				case 'upload': //上传文件
					this.$refs.FileArea.value = '';
					this.$refs.FileArea.click();
					if (datas) {
						this.PrepareUploadFile(datas.dataTransfer);
						this.ShowUploadTips = false;
					}
					break;
				case 'download': //下载文件
					if (this.DiskData.SelectFiles.length) {
						this.DiskData.SelectFiles.forEach(item => {
							if (item.disk_main) {
								this.SelectDownLoadFiles.push(item);
							}
						});
					} else {
						if (this.DiskData.NowSelect.disk_main) {
							this.SelectDownLoadFiles.push(this.DiskData.NowSelect);
						}
					}
					let tips = this.SelectDownLoadFiles.length > 1 ? '所选' + this.SelectDownLoadFiles.length + '个项目' : this.SelectDownLoadFiles[0].disk_name;
					this.SelectDownLoadFiles.forEach(item => {
						this.$electron.remote.getCurrentWindow().webContents.downloadURL(item.disk_main + '?disk_name=' + item.disk_name);
					});
					this.SelectDownLoadFiles = [];
					this.$Message.info(tips + '已加入下载列队');
					break;
				case 'search': //搜索
					if (flag) {
						this.DiskPage = 1;
						this.UserDiskData = [];
						this.DiskData.ClassifyName = '搜索';
						this.NavigationControl('clear');
					}
					this.$Api.Disk.Search(
						{
							id: datas,
							page: this.DiskPage
						},
						rs => {
							this.DiskBatchData('print', rs);
						}
					);
					break;
				case 'sort': //网盘排序方法
					if (typeof datas === 'object') {
						this.UserDiskData = datas;
					} else {
						this.$refs.DiskSortBar.DiskSort(datas, flag);
					}
					break;
				case 'state': //切换文件显示模式
					this.DiskData.DiskShowState = datas;
					break;
				case 'newFolder':
					this.InputConfrim({
						title: '新建文件夹',
						tips: '请输入文件夹名称',
						callback: value => {
							if (value.length === 0) {
								return this.$Message.error('文件夹名称不能为空');
							}
							this.$Api.Disk.NewFolder(
								{
									name: value,
									parent_id: this.NowDiskID
								},
								rs => {
									rs = rs[0];
									if (rs.disk_id) {
										this.UserDiskData.push(rs);
										this.$Message.success(value + ' 已创建');
									} else {
										this.$Message.error(value + ' 已存在');
									}
								}
							);
						}
					});
					break;
				case 'clear':
					this.DiskData.Clipboard = [];
					break;
				case 'MoveTo':
					this.ShowUnZip = false;
					this.showTree = true;
					break;
				case 'paste': //粘贴
					let CutFlag = true;
					let CopySize = 0;
					if (this.DiskData.Clipboard.length === 0) {
						return;
					}
					this.DiskData.Clipboard.forEach(item => {
						CopySize = CopySize + parseInt(item.disk_size);
						if (this.NowDiskID === item.disk_id) {
							this.DiskFeatureControl('clear');
							CutFlag = false;
						}
					});
					if (this.DiskData.ClipboardType === 'Copy') {
						if (CopySize > this.DiskData.DiskSize.total - this.DiskData.DiskSize.use) {
							return this.$Message.error('空间不足！请清理一些文件后重试');
						}
					} else if (this.DiskData.ClipboardType === 'Cut') {
						if (this.DiskData.Clipboard[0].parent_id === this.NowDiskID) {
							this.$Message.info('剪切和粘贴目录为同一个，已清空剪贴板');
							return this.DiskFeatureControl('clear');
						}
						if (!CutFlag) {
							return this.$Message.warning('剪贴板内包含粘贴目标，请重新选择');
						}
					}
					this.$Message.info('正在粘贴文件，请稍候');
					data = this.DiskBatchData('post', this.DiskData.Clipboard);
					this.$Api.Disk[this.DiskData.ClipboardType](
						{
							id: data,
							parent_id: this.NowDiskID
						},
						rs => {
							rs = rs[0];
							if (rs.state === 'success') {
								let CopyFlag = false; //判断是否有复制和粘贴时同一个目录的
								this.DiskData.Clipboard.forEach(item => {
									if (this.DiskData.ClipboardType === 'Copy') {
										item.disk_name = item.disk_name + '-复制';
										if (item.parent_id === this.NowDiskID) {
											CopyFlag = true;
										}
									}
									item.parent_id = this.NowDiskID;
									this.UserDiskData.push(item);
								});
								if (CopyFlag) {
									this.NavigationControl('reload');
								}
								this.$Message.success('粘贴成功，共' + this.DiskData.Clipboard.length + '个项目');
								this.DiskFeatureControl('clear');
							} else {
								this.$Message.error('粘贴失败');
							}
						}
					);
					break;
				case 'trash': //移入回收站:
					let trash_data = this.DiskBatchData();
					data = this.DiskBatchData('post', trash_data);
					this.Confrim({
						title: '移入回收站',
						tips: '是否将所选' + trash_data.length + '个项目移入回收站',
						callback: () => {
							this.$Api.Disk.Trash(
								{
									id: data
								},
								rs => {
									rs = rs[0];
									if (rs.state === 'success') {
										this.$Message.success('移入回收站成功');
										this.DiskBatchData('remove', trash_data);
									} else {
										this.$Message.error('移入回收站失败');
									}
								}
							);
						}
					});
					break;
				case 'delete': //文件删除
					let delete_data = this.DiskBatchData();
					data = this.DiskBatchData('post', delete_data);
					this.Confrim({
						title: '删除',
						tips: '是否将所选' + delete_data.length + '个项目彻底删除',
						callback: () => {
							this.$Api.Disk.Delete(
								{
									id: data
								},
								rs => {
									rs = rs[0];
									if (rs.state === 'success') {
										this.$Message.success('删除成功');
										this.DiskBatchData('remove', delete_data);
									} else {
										this.$Message.success('删除失败');
									}
								}
							);
						}
					});
					break;
				case 'restore': //文件还原
					let restore_data = this.DiskBatchData();
					data = this.DiskBatchData('post', restore_data);
					this.Confrim({
						title: '还原文件',
						tips: '是否将所选' + restore_data.length + '个项目移出回收站',
						callback: () => {
							this.$Api.Disk.Restore(
								{
									id: data
								},
								rs => {
									rs = rs[0];
									if (rs.state === 'success') {
										this.$Message.success('还原成功');
										this.DiskBatchData('remove', restore_data);
									} else {
										this.$Message.success('还原失败');
									}
								}
							);
						}
					});
					break;
				case 'rename': //重命名
					this.InputConfrim({
						title: '重命名',
						tips: '请输入新的文件/文件夹名称',
						value: this.DiskData.NowSelect.disk_name,
						callback: value => {
							if (value.length === 0) {
								return this.$Message.error('文件名不能为空');
							}
							this.$Api.Disk.Rename(
								{
									name: value,
									id: this.DiskData.NowSelect.disk_id
								},
								rs => {
									rs = rs[0];
									if (rs.state === 'success') {
										this.UserDiskData[this.DiskData.NowIndex].disk_name = value;
										this.$Message.success('重命名成功');
									} else {
										this.$Message.error('重命名失败');
									}
								}
							);
						}
					});
					break;
				case 'info': //文件属性
					this.$ipc.send('file-control', 'attributes', this.DiskData.NowSelect);
					break;
				case 'share': //提交文件分享
					if (this.DiskData.NowSelect.share) {
						let message = '该文件分享地址为:' + this.DiskData.NowSelect.shareAddress;
						this.Confrim({
							title: '分享信息',
							tips: message,
							type: 'info',
							confirmButtonText: '复制',
							callback: () => {
								this.$Message.info('链接已复制');
								this.$electron.clipboard.writeText(this.DiskData.NowSelect.shareAddress);
							}
						});
					} else {
						this.showShare = true;
					}
					break;
				case 'post-share': //查看分享
					this.$refs.DiskShareModel.ShareFile(this.DiskData.NowSelect);
					break;
				case 'update-share': //更新文件分享状态
					this.FindInDisk(this.DiskData.NowSelect, item => {
						item.share = datas;
						item.shareAddress = localStorage.server + '/s/' + datas;
					});
					break;
				case 'cancel-share': //取消分享
					this.Confrim({
						title: '取消分享',
						tips: '您确认取消分享' + this.DiskData.NowSelect.disk_name + '吗',
						callback: () => {
							this.$Api.Disk.CancelShare(
								{
									id: this.DiskData.NowSelect.disk_id,
									share_id: this.DiskData.NowSelect.share
								},
								rs => {
									if (rs[0].state === 'success') {
										this.$Message.success('分享已取消');
										this.$nextTick(() => {
											if (this.loadClassify === 'share') {
												let data = [];
												data.push(this.DiskData.NowSelect);
												this.DiskBatchData('remove', data);
											} else {
												this.FindInDisk(this.DiskData.NowSelect, item => {
													item.share = '';
												});
											}
										});
									} else {
										this.$Message.error('操作失败');
									}
								}
							);
						}
					});
					break;
				case 'reload':
					this.NavigationControl(commend);
					break;
				case 'popup':
					if (this.ConfigObject.NoticeFlag) {
						this.NoticeSrc = localStorage.NoticeVoice;
						let a = setTimeout(() => {
							clearTimeout(a);
							this.$refs.NoticeAudio.play();
						}, 200);
					}
					if (this.ConfigObject.NoticeBubble) {
						this.$notify(datas);
						//this.$ipc.send('system', 'popup', datas);
					}
					break;
			}
		},
		/*批量数据操作*/
		DiskBatchData(commend, data) {
			let BatchData = [];
			commend = commend ? commend : 'select';
			switch (commend) {
				case 'select': //获取选择的文件，生成数组
					if (this.DiskData.SelectFiles.length) {
						BatchData = this.DiskData.SelectFiles;
					} else {
						BatchData.push(this.DiskData.NowSelect);
					}
					break;
				case 'post': //将准备传输的文件数据转换为逗号连接的字符串
					BatchData = '';
					for (let j = 0; j < data.length; j++) {
						BatchData = BatchData + data[j].disk_id + ',';
					}
					BatchData = BatchData.substring(0, BatchData.length - 1);
					break;
				case 'remove': //将网盘上的data数据remove
					for (let i = 0; i < this.UserDiskData.length; i++) {
						for (let j = 0; j < data.length; j++) {
							if (data[j].disk_id === this.UserDiskData[i].disk_id) {
								this.UserDiskData.splice(i, 1);
							}
						}
					}
					break;
				case 'print':
					if (this.DiskPage === 1) {
						this.DiskAllCount = 0;
						this.DiskLoadCount = 0;
					}
					this.LoadCompany = true;
					data.forEach(item => {
						this.UserDiskData.push(item);
					});
					if (data.length) {
						this.DiskData.DiskSize.total = data[0].max_size;
						this.DiskData.DiskSize.use = data[0].use_size;
						this.DiskData.DiskSize.text = '可用:' + this.$Api.Disk.FileSize(this.DiskData.DiskSize.total - this.DiskData.DiskSize.use);
						/*let Percent = (this.DiskData.DiskSize.use / this.DiskData.DiskSize.total) * 100;
                            this.DiskData.DiskSize.Percent = Percent + '%';
                            if (65 < Percent && Percent < 85) {
                                this.DiskData.DiskSize.Background = '#f7ab21';
                            } else if (Percent >= 85) {
                                this.DiskData.DiskSize.Background = '#e83c3c';
                            } else {
                                this.DiskData.DiskSize.Background = '#7c7cee';
                            }*/
						this.DiskAllCount = data[0].all_count;
						this.DiskLoadCount = this.DiskLoadCount + data.length;
					}
					break;
			}
			return BatchData;
		},
		/*获取用户文件*/
		GetMainFile(id, type) {
			if (this.DiskData.Type === 'trans') {
				return;
			}
			if (this.DiskPage === 1) {
				this.UserDiskData = []; //清空数据
				this.LoadCompany = false;
			}
			if (!id) {
				id = 'null';
			}
			if (this.loadClassify !== type) {
				this.DiskLoadCount = 0;
				this.DiskPage = 1;
				this.LoadCompany = false;
			}
			this.NowDiskID = id;
			this.loadClassify = type;
			this.$Api.Disk.LoadMainFile(
				{
					id: id,
					page: this.DiskPage,
					loadtype: this.loadClassify
				},
				rs => {
					this.DiskBatchData('print', rs);
				}
			);
		},
		LoadMore() {
			let elm = event.target;
			if (elm.scrollTop + elm.offsetHeight >= elm.scrollHeight - 32 && this.DiskLoadCount < this.DiskAllCount) {
				if (this.LoadCompany) {
					this.DiskPage++;
					this.GetMainFile(this.NowDiskID, this.loadClassify);
				}
			}
		}, //下拉加载更多
		/*选择文件数据操作方法*/
		SelectFiles(event, item, index) {
			this.$refs.CloudDiskMain.focus();
			this.$refs.MouseMenu.MenuShow('file');
			if (event.button === 0) {
				event.stopPropagation();
				if (this.DiskData.KeyFlag === 'Ctrl') {
					//Ctrl多选
					item.active = !item.active; //反选
				} else if (this.DiskData.KeyFlag === 'Shift') {
					//Shift多选
					let Start = index,
						End;
					item.active = true;
					if (this.DiskData.NowSelect) {
						for (let i = 0; i < this.UserDiskData.length; i++) {
							if (this.UserDiskData[i] === this.DiskData.NowSelect) {
								Start = i;
							}
							if (this.UserDiskData[i] === item) {
								End = i;
							}
						}
					}
					for (let j = Math.min(End, Start); j < Math.max(End, Start) + 1; j++) {
						this.UserDiskData[j].active = true;
					}
				} else if (!this.DiskData.KeyFlag) {
					//单选
					this.ClearSelect();
					item.active = true;
					this.DiskData.NowIndex = index; //记录当前是第几个
					this.DiskData.NowSelect = item;
				}
			} else if (event.button === 2) {
				this.DiskData.NowIndex = index;
				this.DiskData.NowSelect = item;
			}
		},
		RemoveSelect(index) {
			this.DiskData.SelectFiles.splice(index, 1);
		},
		ClearSelect() {
			this.UserDiskData.forEach(item => {
				item.active = false;
			});
			this.DiskData.SelectFiles = [];
		},
		/*右键菜单函数*/
		ControlTrans(item, index) {
			if (event.target.className === 'sf-icon-times') {
				if (item.trans_type === 'download') {
					this.$ipc.send('download', 'cancel', item.id);
				}
				return this.TransformData.splice(index, 1);
			}
			if (item.state === 'completed') {
				return this.TransformData.splice(index, 1);
			}
			if (item.trans_type === 'upload') {
				item.state = item.state === 'interrupted' ? 'progressing' : 'interrupted';
				this.PrepareUploadFile(item);
			} else {
				let commend = item.state === 'progressing' ? 'pause' : 'resume';
				this.$ipc.send('download', commend, item.id);
			}
		}, //传输任务控制
		UploadDrop(e) {
			if (this.loadClassify === 'normal') {
				this.PrepareUploadFile(e.dataTransfer);
				this.ShowUploadTips = false;
			}
		}, //拖拽上传
		PrepareUploadFile(data) {
			upload.prepareFile(data, {
				data: this.NowDiskID,
				add: file => {
					this.TransformData.push(file);
					this.$Message.info((data.target ? data.target : data).files.length + '个文件已加入上传列队');
				},
				success: (file, rs) => {
					if (this.NowDiskID === rs.data.parent_id) {
						this.UserDiskData.push(rs.data);
					}
					this.DiskFeatureControl('popup', file.name + '上传完成'); /*消息提醒*/
				}
			});
		},
		DiskUnZip() {
			if (!this.SelectTrees) {
				return this.$Message.warning('请选择一个解压目录');
			}
			this.showTree = false;
			this.ShowUnZip = false;
			if (this.DiskData.NowSelect.disk_size > 209715200) {
				return this.$Message.warning('目前只能解压小于200M的压缩包');
			}
			this.$Message.info('开始解压，这可能需要一点时间');
			this.$Api.Disk.UnZip(
				{
					url: this.DiskData.NowSelect.disk_main.split(localStorage.server)[1],
					parent_id: this.SelectTrees.disk_id
				},
				rs => {
					if (!rs[0]) {
						return this.$Message.error('解压失败');
					}
					rs = rs[0];
					if (rs.state === 'success') {
						this.$Message.success('解压完成');
						this.$nextTick(() => {
							this.UserDiskData.push(rs.data);
						});
					} else {
						this.$Message.error('解压失败');
					}
					this.SelectTrees = false;
				}
			);
		},
		/*树目录操作方法*/
		DiskMoveUp() {
			if (this.DiskData.SelectFiles.length) {
				this.DiskData.SelectFiles.forEach((item, index) => {
					if (this.SelectTrees.disk_id === item.disk_id) {
						this.DiskData.SelectFiles.splice(index, 1);
					}
				});
				let data = this.DiskBatchData('post', this.DiskData.SelectFiles);
				if (this.DiskData.SelectFiles[0].parent_id === this.SelectTrees.disk_id) {
					this.$Message.warning('操作取消,所选 ' + this.SelectTrees.disk_name + ' 为当前所在目录');
					this.showTree = false;
					this.SelectTrees = false;
					return;
				}
				this.$Api.Disk.Cut(
					{
						parent_id: this.SelectTrees.disk_id,
						id: data
					},
					rs => {
						rs = rs[0];
						if (rs.state === 'success') {
							this.DiskBatchData('remove', this.DiskData.SelectFiles);
							this.$Message.success('已移动到 ' + this.SelectTrees.disk_name);
							this.showTree = false;
							this.SelectTrees = false;
						} else {
							this.$Message.error('移动失败');
						}
					}
				);
			} else {
				this.$Message.warning('操作终止！没有选中任何文件');
			}
		},
		SelectDiskTree(item) {
			this.SelectTrees = item;
		}, //选择树目录
		MainMouseFunc() {
			this.$refs.CloudDiskMain.focus();
			if (this.NoTransType) {
				this.$refs.MouseMenu.MenuShow();
				if (event.button === 0) {
					this.MouseSelect();
				}
			}
		},
		MouseSelect() {
			event.preventDefault();
			event.stopPropagation();
			let area = event.target;
			let start = {
				x: event.clientX - area.getBoundingClientRect().left + area.scrollLeft,
				y: event.clientY - area.getBoundingClientRect().top + area.scrollTop,
				maxy: area.scrollHeight
			};
			this.MouseSelectData.left = start.x;
			this.MouseSelectData.top = start.y;
			document.onmouseup = () => {
				this.MouseSelectData = {
					left: 0,
					top: 0,
					width: 0,
					height: 0
				};
				document.onmousemove = null;
			};
			document.onmousemove = ev => {
				let end = {
					x: ev.clientX - area.getBoundingClientRect().left + area.scrollLeft,
					y: ev.clientY - area.getBoundingClientRect().top + area.scrollTop,
					scrolldown: Math.min(ev.clientY - area.getBoundingClientRect().top, event.clientY - area.getBoundingClientRect().top) + 10 + area.offsetHeight,
					scrollup: Math.min(ev.clientY - area.getBoundingClientRect().top, event.clientY - area.getBoundingClientRect().top)
				};
				this.MouseSelectData = {
					left: Math.min(start.x, end.x) + 'px',
					top: Math.min(start.y, end.y) + 'px',
					width: Math.abs(end.x - start.x) + 'px',
					height: Math.abs(end.y - start.y) + 'px'
				};
				let area_data = {
					left: Math.min(start.x, end.x),
					top: Math.min(start.y, end.y),
					width: Math.abs(end.x - start.x),
					height: Math.abs(end.y - start.y)
				};
				let selList = document.getElementsByClassName(this.DiskData.DiskShowState);
				this.ClearSelect();
				for (let i = 0; i < selList.length; i++) {
					let sl = selList[i].offsetWidth + selList[i].offsetLeft,
						st = selList[i].offsetHeight + selList[i].offsetTop;
					let area_l = area_data.left + area_data.width;
					let area_t = area_data.top + area_data.height;
					if (sl > area_data.left && st > area_data.top && selList[i].offsetLeft < area_l && selList[i].offsetTop < area_t) {
						if (this.UserDiskData[i].active === false) {
							this.UserDiskData[i].active = true;
						}
					} else {
						if (this.UserDiskData[i].active) {
							this.UserDiskData[i].active = false;
						}
					}
				}
			};
		},
		FindInDisk(list, callback) {
			let result = null;
			this.UserDiskData.forEach(item => {
				if (item.disk_id === list.disk_id) {
					result = item;
					callback(item);
				}
			});
			return result;
		}
	}
};
</script>

<style scoped>
/*上传提示*/
.cd-upload-tips {
	width: 100%;
	height: 35px;
	line-height: 35px;
	background: rgba(91, 91, 234, 0.71);
	position: relative;
	text-indent: 20px;
	top: -2px;
	z-index: 3;
	-webkit-animation-duration: 0.35s;
	animation-duration: 0.35s;
	-webkit-animation-fill-mode: both;
	animation-fill-mode: both;
	-webkit-animation-name: slideInDown;
	animation-name: slideInDown;
	color: #fff;
}
/*分享提示*/
.cd-share-select {
	font-size: 16px;
	padding-bottom: 5px;
	height: 25px;
}
.cd-share-select span {
	color: #5b5bea;
}
/*拖选框*/
.cd-mouse-select {
	position: absolute;
	background: #f4f5f7;
	opacity: 0.7;
	border: 2px solid #eee;
	z-index: 1;
}
</style>
