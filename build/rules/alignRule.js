var __extends = this.__extends || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    __.prototype = b.prototype;
    d.prototype = new __();
};
var Rule = (function (_super) {
    __extends(Rule, _super);
    function Rule() {
        _super.apply(this, arguments);
    }
    Rule.prototype.apply = function (sourceFile) {
        var alignWalker = new AlignWalker(sourceFile, this.getOptions());
        return this.applyWithWalker(alignWalker);
    };
    Rule.PARAMETERS_OPTION = "parameters";
    Rule.ARGUMENTS_OPTION = "arguments";
    Rule.STATEMENTS_OPTION = "statements";
    Rule.FAILURE_STRING_SUFFIX = " are not aligned";
    return Rule;
})(Lint.Rules.AbstractRule);
exports.Rule = Rule;
var AlignWalker = (function (_super) {
    __extends(AlignWalker, _super);
    function AlignWalker() {
        _super.apply(this, arguments);
    }
    AlignWalker.prototype.visitFunctionDeclaration = function (node) {
        this.checkAlignment(Rule.PARAMETERS_OPTION, node.parameters);
        _super.prototype.visitFunctionDeclaration.call(this, node);
    };
    AlignWalker.prototype.visitFunctionExpression = function (node) {
        this.checkAlignment(Rule.PARAMETERS_OPTION, node.parameters);
        _super.prototype.visitFunctionExpression.call(this, node);
    };
    AlignWalker.prototype.visitCallExpression = function (node) {
        this.checkAlignment(Rule.ARGUMENTS_OPTION, node.arguments);
        _super.prototype.visitCallExpression.call(this, node);
    };
    AlignWalker.prototype.visitBlock = function (node) {
        this.checkAlignment(Rule.STATEMENTS_OPTION, node.statements);
        _super.prototype.visitBlock.call(this, node);
    };
    AlignWalker.prototype.checkAlignment = function (kind, nodes) {
        if (nodes.length === 0 || !this.hasOption(kind)) {
            return;
        }
        var prevPos = this.getPosition(nodes[0]);
        var alignToColumn = prevPos.character;
        for (var index = 1; index < nodes.length; index++) {
            var node = nodes[index];
            var curPos = this.getPosition(node);
            if (curPos.line !== prevPos.line && curPos.character !== alignToColumn) {
                this.addFailure(this.createFailure(node.getStart(), node.getWidth(), kind + Rule.FAILURE_STRING_SUFFIX));
                break;
            }
            prevPos = curPos;
        }
    };
    AlignWalker.prototype.getPosition = function (node) {
        return node.getSourceFile().getLineAndCharacterFromPosition(node.getStart());
    };
    return AlignWalker;
})(Lint.RuleWalker);