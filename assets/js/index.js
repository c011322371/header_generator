//========================
// TODO: 時間に余裕あればコンストラクタ化
//       json内整えたい
//
// author: c011322371
// last update: 2018/03/15
// 基本自分用なので荒めに書いてます
//========================

var HEAD_GENERATOR = {
  load : function(){
    $.ajax({
        url : "./assets/json/meta.json",
        type : 'GET',
        dataType : 'json',
        cache : false,
    }).then(
      $.proxy(function(data) { this.init(data); },this),
      function(data) { console.log('error'); }
    )
  },
  init : function(data){
    this.jsonData = data[0];
    this.sendJsonData();
    this.setParameters();
    this.bindEvent();
  },
  sendJsonData: function() {
    // create meta list dom
    var jsonSize = Object.keys(this.jsonData).length;
    CLONE_META_LIST.init(jsonSize);
  },
  setParameters: function() {
    this.$preview       = $('.jsc-preview');
    this.$toggle        = $('.jsc-toggle_switch');
    this.$metaEditField = $('.jsc-edit_meta_field');
    this.$generateBtn   = $('.jsc-generate-btn');
    this.$cleaner       = $('.jsc-cleaner');
    this.$detailsBtn    = $('.jsc-meta-details');
    this.$detailsPreview = $('.jsc-details-preview');
  },
  bindEvent: function() {
    // set meta data
    this.$toggle.each($.proxy(function(index,target){
      var $target = $(target);
      this.setMetaTarget($target);
      this.setMetaProperty();
      this.checkToggleState($target);
    },this));

    // toggle時の処理
    this.$toggle.on('change', $.proxy(function(e) {
      var $target = $(e.target);
      this.setMetaTarget($target);
      this.checkToggleState($target);
    },this));

    // previewへの反映処理
    this.$generateBtn.on('click', $.proxy(function() {
      this.applyPreview();
    },this));

    // preview cleaner
    this.$cleaner.on('click', $.proxy(function() {
      this.CleanPreview();
    },this));

    // show details
    this.$detailsBtn.on('click', $.proxy(function(e) {
      var $target = $(e.target);
      this.setMetaTarget($target);
      this.$detailsPreview.val(this.jsonData[this.metaID].details);
    },this));
  },
  setMetaTarget: function($target) {
    this.$metaList = $target.closest('li');
    this.$target_metaEditField = this.$metaList.find('.jsc-edit_meta_field');
    this.$target_metaDescription = this.$metaList.find('.jsc-meta-description');
    this.metaID = this.$metaList.find('.jsc-toggle_switch').attr('id');
    this.meta = this.jsonData[this.metaID].meta.replace(/'/g, '"'); // ' -> " 変換
  },
  setMetaProperty: function() {
    this.$target_metaDescription.text(this.jsonData[this.metaID].description);
    this.$target_metaEditField.val(this.meta);
    // 必須項目であればチェック状態にする　
    if(this.jsonData[this.metaID].required) {
      this.$metaList.find('.jsc-toggle_switch').prop('checked', true);
    }
  },
  checkToggleState: function($target) {
    if($target.is(":checked")) {
      this.$target_metaEditField.prop('disabled',false);
    } else {
      this.$target_metaEditField.prop('disabled',true);
    }
  },
  applyPreview: function() {
    // generateBtn押下時に発火するメソッド
    var metaInfo = [];
    this.$metaEditField.each(function() {
      // 空文字の場合は配列に入れない
      if($(this).val().length==0 || $(this).is(':disabled')) {
        return;
      } else {
        metaInfo.push($(this).val());
      }
    });
    this.$preview.val(metaInfo.join('\n'));
  },
  CleanPreview: function() {
    this.$preview.val('');
  }
};

var CLONE_META_LIST = {
  init: function(jsonSize) {
    this.jsonSize = jsonSize;
    this.setParameters();
    this.bindEvent();
  },
  setParameters: function() {
    this.$metaListWrapper = $('.jsc-meta-list');
    this.$metaListTemplate = this.$metaListWrapper.children('li').detach();
  },
  bindEvent: function() {
    this.createMetaList();
  },
  createMetaList: function() {
    var metaFragment = document.createDocumentFragment();
    for(var i=0; i<this.jsonSize; i++) {
      var $metaClone = this.$metaListTemplate.clone(),
          $toggle_input = $metaClone.find('.jsc-toggle_switch'),
          $toggle_label = $metaClone.find('.jsc-toggle_label');
      $toggle_input.attr("id", "toggle_switch_" + (i+1));
      $toggle_label.attr("for", "toggle_switch_" + (i+1));
      metaFragment.appendChild($metaClone.get(0));
    }
    this.$metaListWrapper.get(0).appendChild(metaFragment);
  }
};

$(function() {
  HEAD_GENERATOR.load();
});
