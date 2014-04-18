<?php
 /*
	Plugin Name: SkipTo
	Plugin URI: https://github.com/paypal/SkipTo
	Description: A simple way to expand the usefullness of your site's "Skip To Content" functionality.
	Version: 0.1.2
	Author: Nawaz Khan, Victor Tsaran, Ron Feathers, and Marc Kocher
	Author URI: https://github.com/paypal
	License: Apache-2.0
*/

	$skipTo_url = '//www.paypalobjects.com/webstatic/uie/SkipTo.min.js';

	function skipto_load_js_and_css() {
		global $skipTo_url;

		wp_register_script( 'skipInit.js', plugins_url( 'skipto/js/skipToInit.js' , dirname(__FILE__) ), '', '1.1', true);
		wp_enqueue_script( 'skipInit.js' );

		wp_register_script( 'SkipTo.js', $skipTo_url, '', '', true);
		wp_enqueue_script( 'SkipTo.js' );
	}

	add_action('wp_loaded', 'skipto_load_js_and_css');
	add_action('admin_menu', 'skip_settings_menu');

	function skip_settings_menu() {
		add_options_page('Skip To Configurations', 'SkipTo', 'manage_options', 'SkipId', 'skipTo_options');
	}


	function skipTo_options() {
		if (!current_user_can( 'manage_options' )) {
			wp_die( __( 'You do not have sufficient permissions to access this page.' ) );
		}
		$headings_list=array(
								"h1"=>"Headings Level1",
								"h2" => "Headings Level2",
								"h3" => "Headings Level3",
								"h4" => "Headings Level 4",
								"h5" => "Headings Level5",
								"h6" => "Headings Level6"
							);
		$landmarks_list=array(
								"role-search" => "Search Landmarks",
								"role-banner" => "Banner Landmarks",
								"role-navigation" => "Navigation Landmarks",
								"role-complementary" => "Complementary Landmarks",
								"role-contentinfo" => "Contentinfo Landmarks",
								"role-main" => "Main Landmarks"
							);

		$conf_file=  plugin_dir_path(__FILE__) . 'js/skipToInit.js';
		$post_headings='';
		$post_roles='';

		if(!empty($_POST)){
			foreach(array_keys($_POST) as $k) {
				if (array_key_exists($k, $headings_list)){ 
					$post_headings .= ',' . $k; 
				}
				if (array_key_exists($k, $landmarks_list)){ 
					$post_roles .= ',[' . str_replace("-","=",$k) . ']'; 
				}
			}

			$post_headings = substr($post_headings, 1);
			$post_roles = substr($post_roles, 1);
			$accesskey = $_POST['accesskey'];

			if(!empty($post_headings) or !empty($post_roles)) {
				$arrw = array();
				if(empty($post_headings)) {
					$post_headings = 'false';
				}
				if(empty($post_roles)){
					$post_roles = 'false';
				}
				if(empty($accesskey)){
						$accesskey = '0';
				}

				$arrw['settings']['skipTo']['headings'] =  $post_headings;
				$arrw['settings']['skipTo']['landmarks'] = $post_roles;
				$arrw['settings']['skipTo']['accesskey'] = $accesskey;
				$arrw['settings']['skipTo']['wrap'] = $_POST['wrap'];
				$arrw['settings']['skipTo']['visibility'] = $_POST['visibility'];
				$arrw['settings']['skipTo']['ids'] = $_POST['idsandclass'];
				$arrw['settings']['skipTo']['customClass'] = $_POST['customclass'];
				$arrw['settings']['skipTo']['attachElement'] = $_POST['attachelement'];

				$fputcontents = 'var Wordpress =' . json_encode($arrw) . ';';
				file_put_contents($conf_file,  $fputcontents);
				echo '<div class="updated"><p><strong>Skip To Settings saved.</strong></p></div>';
			} 
		}	

		$contents = file_get_contents($conf_file);
		$contents = preg_replace("/(var|;|Wordpress)/", " ", $contents); 
		$contents = substr_replace($contents, $str_replacement, strpos($contents, '='), strlen('=')); 
		$arr = json_decode( $contents, true);

		$headings = $arr['settings']['skipTo']['headings'];
		$landmarks = $arr['settings']['skipTo']['landmarks'];
		$accesskey = $arr['settings']['skipTo']['accesskey'];
		$wrap = $arr['settings']['skipTo']['wrap'];
		$visibility = $arr['settings']['skipTo']['visibility'];

		$idsandclass = $arr['settings']['skipTo']['ids'];
		$customclass = $arr['settings']['skipTo']['customClass'];
		$attachelement = $arr['settings']['skipTo']['attachElement'];
?>
		<div class="wrap">
			<h2>SkipTo Settings</h2>
			<form name="form1" method="post" action="">
				<div style="width:70%; overflow:hidden; padding-top:40px">
					<div style="float:left; font-weight:bold" id="headings">Headings</div>
					<div style="float:left; padding-left:160px;" aria-labelledby="headings">
						<?php
							$headings_arr=array_map('trim',explode(",",$headings));
							foreach ($headings_list as $key => $value){
								$hFld .= '<label style="display:block;"><input type="checkbox" name="' . $key . '"';
								if(in_array($key, $headings_arr)) {
									$hFld .= ' checked ';
								}	
								$hFld .= ' style="margin-right:10px">' . $value . '</label>';
							}
							echo $hFld;
						?>
					</div>
					<br clear="all" />
					<div style="float:left; padding-top:50px; font-weight:bold" id="landmarks">Landmarks</div>
					<div style="float:left; padding-left:150px; padding-top:50px;" aria-labelledby="landmarks">
						<?php
							$landmarks_arr=array_map('trim',explode(",",$landmarks));
							$landmarks_arr = preg_replace("/(\[|\])/" , "", $landmarks_arr); 
							$landmarks_arr = preg_replace("/(=)/" , "-", $landmarks_arr); 
								foreach ($landmarks_list as $key => $value){
									$lFld.= '<label style="display:block;"><input type="checkbox" name="'.$key.'"';
									if(in_array($key, $landmarks_arr)) $lFld.=' checked ';
									$lFld.=' style="margin-right:10px">'.$value.'</label>';
								}
							echo $lFld;
						?>
					</div>					
					<br clear="all">
					<div style="float:left; padding-top:50px; font-weight:bold">
						<label for="akey">Access Keys</label>
					</div>
					<div style="float:left; padding-left:140px; padding-top:50px;">
							<input id="akey" type="text" name="accesskey" aria-describedBy="headHelp" value="<?php echo $accesskey ?>" size="2" style="border-color:#000000">
							<span class="help" id="headHelp">E.g. :  0</span>
					</div>
					<br clear="all">
					<fieldset>
						<div style="float:left; padding-top:50px; font-weight:bold; padding-left:0px;">
							<legend>Wrap Menu on Key Down</legend>
						</div>
						<div style="float:left; padding-left:71px; padding-top:50px;">
							<input type="radio" id="wrap1" name="wrap"  value="true" <?php if($wrap === 'true'){ echo 'checked'; }?>><label for="wrap1">True</label>
							<input type="radio" id="wrap2" name="wrap"  value="false" <?php if($wrap === 'false'){ echo 'checked'; }?>> <label for="wrap2">False</label>
						</div>
					</fieldset>

					<br clear="all">
					<fieldset>
						<div style="float:left; padding-top:50px; font-weight:bold; padding-left:0px;">
							<legend>Show SkipTo link</legend>
						</div>
						<div style="float:left; padding-left:117px; padding-top:50px;">
							<input type="radio" id="v1" name="visibility"  value="onFocus" <?php if($visibility === 'onFocus'){ echo 'checked'; }?>><label for="v1"> on Keyboard focus</label>
							<input type="radio" id="v2" name="visibility"  value="onLoad" <?php if($visibility === 'onLoad'){ echo 'checked'; }?>> <label for="v2"> when page loads</label>
						</div>
					</fieldset>

					<br clear="all">
					<div style="float:left; padding-top:50px; font-weight:bold">
						<label for="cusid">List of Ids and Class</label>
					</div>
					<div style="float:left; padding-left:100px; padding-top:50px;">
							<input id="cusid" type="text" name="idsandclass" aria-describedBy="cusIDHelp" value="<?php echo $idsandclass ?>"  style="border-color:#000000">
							<span class="help" id="cusIDHelp">E.g. :  #SkipToA1, #SkipToA2 , .skipClass</span>
					</div>

					<br clear="all">
					<div style="float:left; padding-top:50px; font-weight:bold">
						<label for="cusclass">Custom Class</label>
					</div>
					<div style="float:left; padding-left:140px; padding-top:50px;">
							<input id="cusclass" type="text" name="customclass" aria-describedBy="cusClassHlp" value="<?php echo $customclass ?>"  style="border-color:#000000">
							<span class="help" id="cusClassHlp">E.g. :  MyClass</span>
					</div>
					<br clear="all">
					<div style="float:left; padding-top:50px; font-weight:bold">
						<label for="attachElem">Attach Element</label>
					</div>
					<div style="float:left; padding-left:130px; padding-top:50px;">
							<input id="attachElem" type="text" name="attachelement" aria-describedBy="attachElemHelp" value="<?php echo $attachelement ?>"  style="border-color:#000000">
							<span class="help" id="attachElemHelp">E.g. :  .MyCustomClass or #MyCustomId</span>
					</div>

				</div>
				<p class="submit" style="padding-left:216px">
					<input type="submit" name="Submit" class="button-primary" value="<?php esc_attr_e('Save Changes') ?>" />
				</p>
			</form>
		</div>
<?php
	}
?>