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
        return this.applyWithWalker(new SwitchDefaultWalker(sourceFile, this.getOptions()));
    };
    Rule.FAILURE_STRING = "Switch statement doesn't include a 'default' case";
    return Rule;
})(Lint.Rules.AbstractRule);
exports.Rule = Rule;
var SwitchDefaultWalker = (function (_super) {
    __extends(SwitchDefaultWalker, _super);
    function SwitchDefaultWalker() {
        _super.apply(this, arguments);
    }
    SwitchDefaultWalker.prototype.visitSwitchStatement = function (node) {
        var hasDefaultCase = node.clauses.some(function (clause) { return clause.kind === 195 /* DefaultClause */; });
        if (!hasDefaultCase) {
            this.addFailure(this.createFailure(node.getStart(), node.getWidth(), Rule.FAILURE_STRING));
        }
        _super.prototype.visitSwitchStatement.call(this, node);
    };
    return SwitchDefaultWalker;
})(Lint.RuleWalker);
exports.SwitchDefaultWalker = SwitchDefaultWalker;
